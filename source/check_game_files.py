"""Check game artifacts from the repository root."""
from pathlib import Path
from html.parser import HTMLParser

root = Path('Test/game')
for name in ('index.html', 'style.css', 'script.js'):
    path = root / name
    assert path.is_file(), f'Brak pliku: {path}'
    assert path.stat().st_size > 0, f'Pusty plik: {path}'
    print(f'OK: {path}')

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.css = False
        self.js = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link':
            self.css |= (attrs.get('href') == 'style.css'
                         and attrs.get('rel') == 'stylesheet')
        if tag == 'script':
            self.js |= attrs.get('src') == 'script.js'

links = Links()
links.feed((root / 'index.html').read_text(encoding='utf-8'))
assert links.css and links.js, 'Brak lokalnych odwolan CSS/JS'
print('SUKCES: trzy pliki i poprawne odwolania CSS/JS')
