import { Bank } from 'oldschooljs';
import { beforeEach, describe, test } from 'vitest';

import { minigamesCommand } from '../../../src/mahoji/commands/minigames';
import { createTestUser, mockClient } from '../util';

describe('Agility Arena Command', async () => {
	const client = await mockClient();
	const user = await createTestUser();

	beforeEach(async () => {
		await user.reset();
		await client.reset();
	});

	test('Buy graceful', async () => {
		await user.addItemsToBank({
			items: new Bank()
				.add('Agility arena ticket', 250)
				.add('Graceful hood')
				.add('Graceful top')
				.add('Graceful legs')
				.add('Graceful gloves')
				.add('Graceful boots')
				.add('Graceful cape')
		});

		await user.runCommand(minigamesCommand, { agility_arena: { recolor: {} } });
		await user.bankMatch(
			new Bank()
				.add('Brimhaven graceful hood')
				.add('Brimhaven graceful top')
				.add('Brimhaven graceful legs')
				.add('Brimhaven graceful gloves')
				.add('Brimhaven graceful boots')
				.add('Brimhaven graceful cape')
		);
		await user.clMatch(
			new Bank()
				.add('Brimhaven graceful hood')
				.add('Brimhaven graceful top')
				.add('Brimhaven graceful legs')
				.add('Brimhaven graceful gloves')
				.add('Brimhaven graceful boots')
				.add('Brimhaven graceful cape')
		);
	});
});
