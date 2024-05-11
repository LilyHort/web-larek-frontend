// Интерфейс структуры продукта
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	index?: number;
}

// Интерфейс списка продуктов
export interface IProductList {
	total: number;
	items: IProduct[];
}

// Интерфейс заказа
export interface IOrder {
	address: string;
	payment: string;
	email: string;
	phone: string;
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

// Ошибки формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;
