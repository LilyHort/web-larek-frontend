// Интерфейс структуры продукта
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
	button?: HTMLButtonElement;
  }

// Интерфейс списка продуктов
export interface IProductList {
  	total: number;
	items: IProduct[];
}

// Интерфейс формы оплаты
export interface IPaymentForm {
	address: string;
	payment: string;
}

// Интерфейс формы контактов
export interface IContactsForm {
	email: string;
	phone: string;
}

// Интерфейс заказа
export interface IOrder extends IPaymentForm, IContactsForm {
	total: number;
	items: string[];
}

// Интерфейс результата заказа
export interface IOrderResult {
	id: string[];
	total: number;
	error?: string;
}

// Интерфейс модели приложения
export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder | null;
  }


// Интерфейс к главноей странице
interface IMainPageUI {
    counter: number;
    catalog: HTMLElement[];
}

// Интерфейс успешной покупки
interface IPurchaseResultUI {
    total: number;
}
