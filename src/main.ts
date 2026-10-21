import './style.css';
import { SECTIONS } from './sections';
import { renderHome } from './pages/home';
import { installPortraitFallback } from './shared/dom';
import { installSfx } from './shared/sfx';

const app = document.getElementById('app')!;
const nav = document.getElementById('nav')!;

/** Old hash routes from before sections existed, kept so shared links still work. */
const LEGACY_ROUTES: Record<string, string> = { baron: 'baron-matchups' };

nav.innerHTML = SECTIONS.map((s) => `<a href="#/${s.route}" data-route="${s.route}">${s.navLabel}</a>`).join('');

function route() {
  const [first = '', ...params] = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);

  if (LEGACY_ROUTES[first]) {
    location.replace(`#/${[LEGACY_ROUTES[first], ...params].join('/')}`);
    return;
  }

  const section = SECTIONS.find((s) => s.route === first);
  if (section) section.render(app, params);
  else renderHome(app);

  for (const a of nav.querySelectorAll<HTMLAnchorElement>('a')) {
    if (a.dataset.route === section?.route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  document.title = section ? `${section.title} · Wild Rift Tactics` : 'Wild Rift Tactics';
  window.scrollTo(0, 0);
}

installPortraitFallback();
installSfx(document.getElementById('sfx-toggle') as HTMLButtonElement);
window.addEventListener('hashchange', route);
route();
