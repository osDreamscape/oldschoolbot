import { Bank } from 'oldschooljs';

import { Events } from '../../lib/constants';
import { ActivityTaskOptionsWithQuantity } from '../../lib/types/minions';
import { handleTripFinish } from '../../lib/util/handleTripFinish';
import { gloriesInventorySize } from '../../mahoji/lib/abstracted_commands/unchargeGloriesCommand';

export const gloryChargingTask: MinionTask = {
  type: 'GloryUncharging',
	async run(data: ActivityTaskOptionsWithQuantity) {
		const { quantity, userID, channelID } = data;
		const user = await mUserFetch(userID);
		let loot = new Bank();
		for (let i = 0; i < quantity; i++) {
			for (let i = 0; i < gloriesInventorySize; i++) {
					{
						loot.add('Amulet of glory');
					}
				}
			}
		}

		const amnt = loot.amount('Amulet of glory');

		await transactItems({
			userID: user.id,
			collectionLog: false,
			itemsToAdd: loot
		});
		handleTripFinish(user, channelID, str, undefined, data, loot);
	}
};
