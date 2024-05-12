import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';

import { ApiClient } from './components/ApiClient';
import { MainPageUI } from './components/MainPageUI';
import { ProductCardUI } from './components/ProductCardUI';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/modal';
import { BasketUI } from './components/BasketUI';
import { OrderFormUI } from './components/OrderFormUI';
import { PurchaseResultUI } from './components/PurchaseResultUI';
import { AppState } from './components/AppState';

import { IProduct, IOrder } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successOrderTemplate = ensureElement<HTMLTemplateElement>('#success');

// Объект для работы с API
const api = new ApiClient(API_URL, CDN_URL);
// Брокер событий
const events = new EventEmitter();
// Данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const mainPage = new MainPageUI(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые компоненты интерфейса
const basket = new BasketUI(cloneTemplate(basketTemplate), events);
let order: OrderFormUI = null;

// Обновление каталога
events.on('catalog:changed', (items: IProduct[]) => {
	mainPage.catalog = appData.catalog.map((item) => {
		const card = new ProductCardUI('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

// Открыть товар
events.on('card:select', (item: IProduct) => {
	const card = new ProductCardUI('card', cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:add', item),
	});

	// Проверка на наличие товара в корзине и на цену
	const isItemInBasket = appData.basket.some(
		(basketItem) => basketItem.id === item.id
	);
	if (isItemInBasket || item.price === null) {
		if (card.button) {
			card.button.disabled = true;
		}
	}

	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		}),
	});
});

// Добавить в корзину
events.on('card:add', (item: IProduct) => {
	appData.addToOrder(item);
	mainPage.counter = appData.counter;
	modal.close();
});

// Открыть корзину
events.on('basket:open', () => {
	basket.total = appData.total;
	basket.items = appData.basket.map((item, index) => {
		const card = new ProductCardUI('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:delete', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});

	// Отключение/включение кнопки оформление в зависимости от наличия товаров в корзине
	const isBasketEmpty = appData.basket.length === 0;
	basket.setDisabled(basket.button, isBasketEmpty);

	modal.render({
		content: basket.render(),
	});
});

// Удалить товар из корзины
events.on('card:delete', (item: IProduct) => {
	appData.removeFromOrder(item);
	mainPage.counter = appData.counter;
	events.emit('basket:open'); // для новой отрисовки корзины
});

// Открыть окно оформления заказа
events.on('order:open', () => {
	order = new OrderFormUI(cloneTemplate(orderTemplate), events);
	appData.clearOrderFields();
	modal.render({
		content: order.render({
			valid: false,
			errors: '',
		}),
	});
});

// Переход к форме с контактными данными
events.on('order:submit', () => {
	order = new OrderFormUI(cloneTemplate(contactsTemplate), events);
	modal.render({
		content: order.render({
			valid: false,
			errors: '',
		}),
	});
});

// Выбор способа оплаты
events.on('payment:change', (data: { payment: string }) => {
	appData.setOrderField('payment', data.payment);
});

// Изменилось состояние валидации формы
events.on('formErrors:changed', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	order.valid = !address && !email && !phone && !payment;
	order.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/(^order|^contacts)\..*:change/,
	(data: { field: keyof Omit<IOrder, 'items' | 'total'>; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Отправление формы заказа
events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			appData.clearBasket();
			mainPage.counter = appData.counter;
			const success = new PurchaseResultUI(
				cloneTemplate(successOrderTemplate),
				{
					onClick: () => {
						modal.close();
					},
				}
			);

			modal.render({
				content: success.render({
					total: appData.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Блокировка прокрутки страницы при открытом попапе
events.on('modal:open', () => {
	mainPage.locked = true;
});

// Разблокировка прокрутки страницы при закрытом попапе
events.on('modal:close', () => {
	mainPage.locked = false;
});

// Получение списка товаров с сервера
api
	.getProductsList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
