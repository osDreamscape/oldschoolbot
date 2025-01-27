import { Canvas } from '@napi-rs/canvas';
import { AttachmentBuilder } from 'discord.js';
import * as fs from 'fs';

import { canvasImageFromBuffer, printWrappedText } from './canvasUtil';

export const textBoxFile = fs.readFileSync('./src/lib/resources/images/textbox.png');
const mejJalChatHead = fs.readFileSync('./src/lib/resources/images/mejJal.png');
const janeChatHead = fs.readFileSync('./src/lib/resources/images/jane.png');
const santaChatHead = fs.readFileSync('./src/lib/resources/images/santa.png');
const izzyChatHead = fs.readFileSync('./src/lib/resources/images/izzy.png');
const alryTheAnglerChatHead = fs.readFileSync('./src/lib/resources/images/alryTheAngler.png');
const ketKehChatHead = fs.readFileSync('./src/lib/resources/images/ketKeh.png');
const gertrudeChatHead = fs.readFileSync('./src/lib/resources/images/gertrude.png');
const antiSantaChatHead = fs.readFileSync('./src/lib/resources/images/antisanta.png');

export const chatHeads = {
	mejJal: mejJalChatHead,
	jane: janeChatHead,
	santa: santaChatHead,
	izzy: izzyChatHead,
	alry: alryTheAnglerChatHead,
	ketKeh: ketKehChatHead,
	gertrude: gertrudeChatHead,
	antiSanta: antiSantaChatHead
};

const names: Record<keyof typeof chatHeads, string> = {
	mejJal: 'TzHaar-Mej-Jal',
	jane: 'Guildmaster Jane',
	santa: 'Santa',
	izzy: "Cap'n Izzy No-Beard",
	alry: 'Alry the Angler',
	ketKeh: 'Tzhaar-Ket-Keh',
	gertrude: 'Gertrude',
	antiSanta: 'Anti-Santa'
};

export async function newChatHeadImage({ content, head }: { content: string; head: keyof typeof chatHeads }) {
	const canvas = new Canvas(519, 142);
	const ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	const headImage = await canvasImageFromBuffer(chatHeads[head]);
	const bg = await canvasImageFromBuffer(textBoxFile);

	ctx.drawImage(bg, 0, 0);
	ctx.drawImage(headImage, 28, bg.height / 2 - headImage.height / 2);
	ctx.font = '16px RuneScape Quill 8';

	ctx.fillStyle = '#810303';
	const nameWidth = Math.floor(ctx.measureText(names[head]).width);
	ctx.fillText(names[head], Math.floor(307 - nameWidth / 2), 36);
	ctx.fillStyle = '#000';
	printWrappedText(ctx, content, 307, 58, 361);

	return canvas.encode('png');
}

export default async function chatHeadImage({ content, head }: { content: string; head: keyof typeof chatHeads }) {
	const image = await newChatHeadImage({ content, head });
	return new AttachmentBuilder(image);
}

export async function mahojiChatHead({ content, head }: { content: string; head: keyof typeof chatHeads }) {
	const image = await newChatHeadImage({ content, head });
	return {
		files: [{ attachment: image, name: 'image.jpg' }]
	};
}
