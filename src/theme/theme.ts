import css, {CSSMap, IRuleDefinitions} from '../css/css';

export type ThemeProvider = (obj) => CSSMap<any>;
export type ThemeEntry = {
	id: number;
	rules: IRuleDefinitions;
};

const key = `@artifact-project/css/theme/${Date.now()}`;
let cid = 0;

function getId(obj) {
	if (obj[key] === void 0) {
		Object.defineProperty(obj, key, {
			value: cid++,
			writable: false,
			enumerable: false,
		});
	}

	return obj[key];
}

export const theme = {
	for: (target, rules: IRuleDefinitions): ThemeEntry => ({
		id: getId(target),
		rules,
	}),

	create: (...entries: ThemeEntry[]): ThemeProvider => {
		const cssMapFor = {};
		const themeFor = entries.reduce((all, entry) => {
			all[entry.id] = entry;
			return all;
		}, {});

		return (target) => {
			const id = getId(target);

			if (!cssMapFor.hasOwnProperty(id)) {
				cssMapFor[id] = themeFor.hasOwnProperty(id) ? css(themeFor[id].rules) : {};
			}

			return cssMapFor[id];
		};
	},
};
