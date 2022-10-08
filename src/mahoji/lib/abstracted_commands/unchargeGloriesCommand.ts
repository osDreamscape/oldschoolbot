import { Time } from 'e';
import { Bank } from 'oldschooljs';

import { ActivityTaskOptionsWithQuantity } from '../../../lib/types/minions';
import { formatDuration } from '../../../lib/util';
import addSubTaskToActivityTask from '../../../lib/util/addSubTaskToActivityTask';
import { calcMaxTripLength } from '../../../lib/util/calcMaxTripLength';

export const gloriesInventorySize = 28;
export const gloriesInventoryTime = Time.Minute * 0.84;

export async function unchargeGloriesCommand(user: MUser, channelID: string, quantity: number | undefined) {
	const userBank = user.bank;

	const amountHas = userBank.amount('Amulet of glory(6)');
	if (amountHas < gloriesInventorySize) {
		return `You don't have enough Amulets of glory(6) to uncharge. Your minion does trips of ${gloriesInventorySize}x glories.`;
	}

	const maxTripLength = calcMaxTripLength(user, 'GloryUncharging');

	const max = Math.min(amountHas / gloriesInventorySize, Math.floor(maxTripLength / invDuration));
	if (!quantity) {
		quantity = Math.floor(max);
	}

	const duration = quantity * invDuration;

	if (duration > maxTripLength) {
		return `${user.minionName} can't go on trips longer than ${formatDuration(
			maxTripLength
		)}, try a lower quantity. The highest amount of inventories of glories you can uncharge is ${Math.floor(
			maxTripLength / invDuration
		)}.`;
	}
	const quantityGlories = gloriesInventorySize * quantity;

	if (userBank.amount('Amulet of glory(6)') < quantityGlories) {
		return `You don't have enough ${quantityGlories}x Amulet of glory(6).`;
	}

	await addSubTaskToActivityTask<ActivityTaskOptionsWithQuantity>({
		userID: user.id,
		channelID: channelID.toString(),
		quantity,
		duration,
		type: 'GloryUncharging'
	});

	await user.removeItemsFromBank(new Bank().add('Amulet of glory(6)', quantityGlories));

	return `${
		user.minionName
	} is now uncharging ${quantityGlories} Amulets of glory(6), doing ${gloriesInventorySize} glories in ${quantity} trips, it'll take around ${formatDuration(
		duration)} to finish. Removed ${quantityGlories}x Amulet of glory(6) from your bank.';
}
