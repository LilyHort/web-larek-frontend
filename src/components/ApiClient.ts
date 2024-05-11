import { IOrder, IOrderResult, IProduct, IProductList} from '../types';
import { Api } from './base/api';

interface IApiClient {
	getProduct(id: string): Promise<IProduct>;
	getProductsList: () => Promise<IProduct[]>;
	orderProducts(order: IOrder): Promise<IOrderResult>;
}

export class ApiClient extends Api implements IApiClient {
	readonly cdnUrl: string;

	constructor(baseUrl: string, cdnUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
		this.cdnUrl = cdnUrl;
	}

	async getProduct(id: string): Promise<IProduct> {
		const product = (await this.get(`/product/${id}`)) as IProduct;
		return { ...product, image: this.cdnUrl + product.image };
	}

	async getProductsList(): Promise<IProduct[]> {
		const resp = (await this.get('/product/')) as IProductList;
		return resp.items.map((product) => ({
			...product,
			image: this.cdnUrl + product.image,
		}));
	}

	async orderProducts(order: IOrder): Promise<IOrderResult> {
		return (await this.post('/order', order)) as IOrderResult;
	}
}
