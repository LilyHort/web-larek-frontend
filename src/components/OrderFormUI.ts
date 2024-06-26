import { Form } from './common/form';
import { IOrder } from '../types';
import { IEvents } from './base/events';

export class OrderFormUI extends Form<IOrder> {
	protected _altButtons;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._altButtons = Array.from(
			container.querySelectorAll('.button_alt')
		) as HTMLButtonElement[];

		if (this._altButtons.length) {
			this._altButtons.forEach((button) => {
				button.addEventListener('click', () => {
					this._altButtons.forEach((button) => {
						this.toggleClass(button, 'button_alt-active', false);
					});
					this.toggleClass(button, 'button_alt-active', true);
					this.payment = button.name;
				});
			});
		}
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(value: string) {
		this.events.emit('payment:change', { payment: value });
	}
}
