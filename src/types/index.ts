// Интерфейс структуры продукта
export interface IProduct {
    id: string;
    description?: string;
    image?: string;
    title: string;
    category?: string;
    price: number;
  }

// Интерфейс списка продуктов
export interface IProductList {
  total: number;
	items: IProduct[];
}

// Интерфейс заказа
export interface IOrder {
	email: string;
	phone: string;
	address: string;
	payment: string;
	total: number;
	items: string[];
}

// Интерфейс результата заказа
export interface IOrderResult {
	id: string[];
	total: number;
	error?: string;
}


  
