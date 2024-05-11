import { Component } from './base/component';
import { createElement, ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

interface IBasketUI {
	items: HTMLElement[];
	total: number;
}

export class BasketUI extends Component<IBasketUI> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this.button = this.container.querySelector('.basket__button');

		if (this.button) {
			this.button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			const emptyBasketParagraph = createElement<HTMLParagraphElement>('p');
			this.setText(emptyBasketParagraph, 'Корзина пуста');
			this._list.replaceChildren(emptyBasketParagraph);
		}
	}

	set total(total: number) {
		this.setText(this._total, total.toString() + ' синапсов');
	}
}
