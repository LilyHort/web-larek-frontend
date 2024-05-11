import { Model } from './base/model';
import { IProduct, IOrder, IAppState, FormErrors } from '../types';


export class AppState extends Model<IAppState> {
	catalog: IProduct[] = [];
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
	};
	formErrors: FormErrors = {};

	// Очистка корзины
	clearBasket() {
		this.order.items = [];
	}

	// Подсчет суммы заказа
	get total() {
		return this.order.items.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	// Получить товары из корзины
	get basket() {
		return this.catalog.filter((item) => this.order.items.includes(item.id));
	}

	// Наполнить каталог
	setCatalog(items: IProduct[]) {
		this.catalog = items;
		this.emitChanges('catalog:changed', { catalog: this.catalog });
	}

	// Установить поле заказа и проверить форму
	setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string) {
		this.order[field] = value;
		if (this.validateOrder(field)) {
			this.emitChanges('order:ready', this.order);
		}
	}

	// Проверить форму
	validateOrder(field: keyof IOrder) {
		const errors: typeof this.formErrors = {};

		if (field !== 'address' && field !== 'payment') {
			if (!this.order.email) {
				errors.email = 'Необходимо указать email';
			}
			if (!this.order.phone) {
				errors.phone = 'Необходимо указать телефон';
			}
		} else {
			if (!this.order.address) {
				errors.address = 'Необходимо указать адрес';
			}
			if (!this.order.payment) {
				errors.payment = 'Необходимо выбрать тип оплаты';
			}
		}

		this.formErrors = errors;
		this.emitChanges('formErrors:changed', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	// Добавить продукт в заказ
	addToOrder(item: IProduct) {
		this.order.items.push(item.id);
		this.order.total = this.total;
	}

	// Удалить продукт из заказа
	removeFromOrder(itemToDelete: IProduct) {
		this.order.items = this.order.items.filter(
			(item) => item !== itemToDelete.id
		);
		this.order.total = this.total;
	}

	// Кол-во товаров в заказе
	get counter(): number {
		return this.order.items.length;
	}
}
