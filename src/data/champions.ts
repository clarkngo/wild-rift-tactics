import type { Champion } from '../types';

/** Champions commonly played in Baron lane. Add more as needed. */
export const BARON_CHAMPIONS: Champion[] = [
  { id: 'aatrox', name: 'Aatrox', img: 'Aatrox' },
  { id: 'camille', name: 'Camille', img: 'Camille' },
  { id: 'darius', name: 'Darius', img: 'Darius' },
  { id: 'drmundo', name: 'Dr. Mundo', img: 'DrMundo' },
  { id: 'fiora', name: 'Fiora', img: 'Fiora' },
  { id: 'garen', name: 'Garen', img: 'Garen' },
  { id: 'gragas', name: 'Gragas', img: 'Gragas' },
  { id: 'gwen', name: 'Gwen', img: 'Gwen' },
  { id: 'illaoi', name: 'Illaoi', img: 'Illaoi' },
  { id: 'irelia', name: 'Irelia', img: 'Irelia' },
  { id: 'jax', name: 'Jax', img: 'Jax' },
  { id: 'jayce', name: 'Jayce', img: 'Jayce' },
  { id: 'kayle', name: 'Kayle', img: 'Kayle' },
  { id: 'kennen', name: 'Kennen', img: 'Kennen' },
  { id: 'ksante', name: "K'Sante", img: 'KSante' },
  { id: 'malphite', name: 'Malphite', img: 'Malphite' },
  { id: 'mordekaiser', name: 'Mordekaiser', img: 'Mordekaiser' },
  { id: 'nasus', name: 'Nasus', img: 'Nasus' },
  { id: 'olaf', name: 'Olaf', img: 'Olaf' },
  { id: 'ornn', name: 'Ornn', img: 'Ornn' },
  { id: 'pantheon', name: 'Pantheon', img: 'Pantheon' },
  { id: 'renekton', name: 'Renekton', img: 'Renekton' },
  { id: 'riven', name: 'Riven', img: 'Riven' },
  { id: 'rumble', name: 'Rumble', img: 'Rumble' },
  { id: 'sett', name: 'Sett', img: 'Sett' },
  { id: 'shen', name: 'Shen', img: 'Shen' },
  { id: 'singed', name: 'Singed', img: 'Singed' },
  { id: 'teemo', name: 'Teemo', img: 'Teemo' },
  { id: 'tryndamere', name: 'Tryndamere', img: 'Tryndamere' },
  { id: 'urgot', name: 'Urgot', img: 'Urgot' },
  { id: 'vayne', name: 'Vayne', img: 'Vayne' },
  { id: 'volibear', name: 'Volibear', img: 'Volibear' },
  { id: 'wukong', name: 'Wukong', img: 'MonkeyKing' },
  { id: 'yasuo', name: 'Yasuo', img: 'Yasuo' },
  { id: 'yone', name: 'Yone', img: 'Yone' },
];

export const championById = new Map(BARON_CHAMPIONS.map((c) => [c.id, c]));

const DDRAGON_VERSION = '14.20.1';
export const portraitUrl = (c: Champion) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${c.img}.png`;
