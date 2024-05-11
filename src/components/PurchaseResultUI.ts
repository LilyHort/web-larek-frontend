import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { IOrderResult } from '../types';

interface IPurchaseResultUIActions {
	onClick: () => void;
}

export class PurchaseResultUI extends Component<IOrderResult> {
	protected _close: HTMLButtonElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: IPurchaseResultUIActions) {
		super(container);

		this._close = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(total: number) {
		this.setText(this._total, `Списано ${total} синапсов`);
	}
}
