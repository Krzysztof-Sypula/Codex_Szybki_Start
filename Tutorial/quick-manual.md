---
title: "Saper z Codex"
subtitle: "Od pierwszego promptu do plików gry"
author: "NCAE_Saper"
date: "22 listopada 2026 · Wersja 1.1"
lang: pl-PL
---

**Quick manual · HTML / CSS / JavaScript**

Praktyczne ćwiczenie tworzenia prostej gry w przeglądarce z pomocą Codex.
Nie wymaga frameworka ani instalowania zależności JavaScript.

Pierwszy mierzalny cel: uzyskać trzy niepuste pliki gry, poprawnie połączone
ze sobą. Pełne sprawdzenie działania gry jest osobnym etapem.

# Spis treści

- 1. Cel i przygotowanie
- 2. Prompt tworzący grę
- 3. Sprawdzenie wyniku
- 4. Uruchomienie i poprawki
- 5. Powtarzanie ćwiczenia i dokumentacja
- 6. Druga iteracja: panel ustawień i minihelp

Spis przedstawia kolejność rozdziałów; nie zawiera numerów stron.

# 1. Cel i przygotowanie

## Co tworzymy?

Saper to gra logiczna, w której odkrywasz pola bez min. Liczba na odkrytym
polu mówi, ile min znajduje się w ośmiu sąsiednich polach. Flagi pomagają
oznaczać podejrzane miejsca. Wygrywasz po odkryciu wszystkich pól bez min.

Zakres pierwszej wersji: plansza 9 × 9, dziesięć min, bezpieczne pierwsze
odkrycie, flagi, automatyczne odkrywanie pustego obszaru i przycisk nowej gry.

## Wymagania

Przygotuj dostęp do działającego Codex, terminal Bash, Python 3 i przeglądarkę.
Poradnik zakłada, że Codex jest już skonfigurowany i może zapisywać pliki
w katalogu projektu. Nie opisuje instalacji ani logowania.
Node.js jest opcjonalny: posłuży jedynie do sprawdzenia składni JavaScript.

## Przygotuj katalog

W terminalu przejdź do katalogu głównego tego projektu. Wykonaj:

```bash
mkdir -p Test/game
```

W tym ćwiczeniu ścieżki są względne wobec katalogu głównego projektu.
Codex powinien pracować w tym samym katalogu. Przed próbą sprawdź zawartość
`Test/game`: jeśli są tam Twoje wcześniejsze pliki, zachowaj ich kopię
lub wybierz inny katalog i odpowiednio zmień prompt.

Docelowa struktura:

```text
Test/
  game/
    index.html
    style.css
    script.js
```

# 2. Prompt tworzący grę

## Przekaż zadanie agentowi

W działającej sesji Codex wklej cały poniższy prompt. Poproś o utworzenie
plików, nie tylko wyświetlenie kodu w odpowiedzi.

```text
Utwórz w Test/game prostą grę Saper w HTML, CSS i JavaScript.
Zapisz trzy niepuste pliki: index.html, style.css i script.js.
HTML ma ładować lokalne style.css i script.js. Nie używaj frameworków,
CDN ani pobieranych zależności. Gra ma działać po otwarciu index.html.

Wymagania:
- plansza 9 × 9 z dokładnie 10 minami;
- miny losowane przy pierwszym odkryciu, poza klikniętym polem;
- liczby od 1 do 8 określające liczbę sąsiednich min;
- odkrywanie po kliknięciu, flagi prawym przyciskiem myszy;
- przycisk trybu flagowania dla ekranów dotykowych;
- odkrywanie połączonego pustego obszaru wraz z jego brzegiem;
- wygrana po odkryciu wszystkich pól bez min;
- przegrana po odkryciu miny i blokada dalszych ruchów;
- przycisk Nowa gra resetujący planszę i stan gry;
- polskie komunikaty, czytelne pola i układ na małym ekranie.

Utwórz pliki teraz. Sprawdź, czy istnieją i nie są puste,
oraz czy HTML odwołuje się do właściwych plików CSS i JS.
Jeżeli dostępny jest Node.js, sprawdź składnię script.js.
Na końcu podaj ścieżki i wyniki faktycznie wykonanych kontroli.
```

## Dlaczego tak szczegółowo?

Ścieżka określa miejsce zapisu. Lista funkcji ustala granice zadania.
Wymóg kontroli plików odróżnia gotowy artefakt od samego opisu rozwiązania.
Nie zakładaj, że odpowiedź „gotowe” oznacza, iż gra została przetestowana
w przeglądarce: sprawdź, jakie kontrole agent rzeczywiście wykonał.

# 3. Sprawdzenie wyniku

## Minimalne kryterium sukcesu

W terminalu, nadal w katalogu głównym projektu, wykonaj:

```bash
python3 - <<'PY'
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
PY
```

Jeśli zobaczysz trzy wiersze `OK` i wiersz `SUKCES`, minimalny cel ćwiczenia
został osiągnięty. Błąd `AssertionError` wskazuje brakujący element.
Ta kontrola nie potwierdza jeszcze poprawności logiki gry.

Opcjonalnie, jeżeli masz Node.js:

```bash
node --check Test/game/script.js
```

Brak komunikatów i kod zakończenia 0 oznaczają poprawną składnię.
To nadal nie jest test zachowania w przeglądarce.

# 4. Uruchomienie i poprawki

## Sprawdzenie ręczne

Otwórz `Test/game/index.html` w przeglądarce. Nie musisz uruchamiać serwera.
Wykonaj następujące czynności:

1. Sprawdź, czy widać 81 pól i przycisk „Nowa gra”.
2. Odkryj pierwsze pole. Nie powinno zawierać miny.
3. Oznacz zakryte pole prawym przyciskiem myszy. Ponowne kliknięcie usuwa flagę.
4. Włącz tryb flagowania i sprawdź flagę zwykłym kliknięciem lub dotykiem.
5. Wyłącz tryb flagowania. Odkrycie pustego pola powinno odsłonić jego obszar.
6. Po trafieniu miny sprawdź komunikat i blokadę dalszego odkrywania.
7. Kliknij „Nowa gra”: pola, flagi i komunikat powinny zostać zresetowane.
8. Zwęź okno do szerokości telefonu i sprawdź, czy plansza mieści się na ekranie.

Wygrana wymaga odkrycia wszystkich pól bez min; samo ustawienie flag
nie powinno kończyć gry. To osobny scenariusz do sprawdzenia.

## Gdy nie powstaną pliki

Przekaż Codex wynik kontroli i konkretne oczekiwanie, na przykład:

```text
Kontrola z rozdziału 3 zgłasza: Brak pliku: Test/game/script.js.
Sprawdź katalog roboczy i przyczynę braku. Utwórz brakujący plik,
nie usuwaj poprawnych plików. Powtórz kontrolę z rozdziału 3
oraz podaj jej wynik. Nie ograniczaj odpowiedzi do fragmentu kodu.
```

W razie błędnego zachowania opisz kroki, wynik i oczekiwanie, np.:
„Po postawieniu flagi lewym kliknięciem nadal odkrywam to pole.
Oczekuję blokady odkrywania do czasu usunięcia flagi”.

W tej próbie dopuszczamy dwie iteracje naprawcze po pierwszej próbie.
Po każdej powtórz kontrolę. Jeśli nadal nie ma sukcesu, zapisz błąd,
sprawdzone przyczyny i ograniczenie środowiska; nie deklaruj ukończenia.

# 5. Powtarzanie ćwiczenia i dokumentacja

## Co zachować?

Zachowaj prompt, pliki oraz wynik kontroli. Kolejne uruchomienie modelu może
wygenerować inną implementację: powtarzalne są wymagania i kryteria odbioru,
a nie identyczna treść kodu.

W tym projekcie `Test/game` jest wynikiem próby poradnika. Katalog `source`
zawiera kod generatora dokumentacji, a `Tutorial` jej źródło i eksporty.
Nie uruchamiaj kolejnej próby nad własnymi zmianami bez ich zachowania.

## Aktualizacja poradnika

Edytuj `Tutorial/quick-manual.md`, a potem w katalogu projektu wykonaj:

```bash
python3 source/build_tutorial.py
```

Generator wymaga Pythona 3, Pandoc, XeLaTeX oraz fontów DejaVu Serif
i DejaVu Sans Mono. Tworzy `Tutorial/quick-manual.odt` oraz
`Tutorial/quick-manual.pdf`. ODT i PDF powstają z tego samego Markdown,
ale ich paginacja może się różnić.

Raport rzeczywistego wykonania ćwiczenia znajduje się w
`Tutorial/test-report.md`. Oddziela sprawdzone wyniki od kontroli,
których jeszcze nie wykonano.

# 6. Druga iteracja: panel ustawień i minihelp

## Od działającej wersji do wygodniejszej gry

Po pierwszej próbie mamy działającą grę. Kolejny prompt rozwija jej interfejs
na podstawie doświadczeń użytkownika. Nie zastępuje pierwszego promptu
z rozdziału 2: należy go wykonać dopiero na istniejących plikach gry.

W tej iteracji użytkownik poprosił o panel po lewej stronie, ustawienia
kwadratowej planszy i liczby min, kolory, opcjonalne dźwięki oraz minihelp.
Zakres 2–30 pól na bok to przyjęte ograniczenie tej implementacji.
„Standardowa” oznacza nasz preset około 12,3% pól (10/81), a nie uniwersalny
wzór obowiązujący we wszystkich odmianach Sapera.

## Drugi prompt do gry

```text
Rozbuduj istniejącą grę w Test/game. Zachowaj działającą logikę
pierwszej wersji i zmodyfikuj jej pliki HTML, CSS i JavaScript.

Dodaj po lewej panel ustawień i minihelp:
- plansza zawsze kwadratowa, bok od 2 do 30 pól;
- całkowita liczba min od 0 do floor(bok * bok / 2);
- przycisk „Standardowa liczba min”: round(bok * bok * 10 / 81);
- po zmianie rozmiaru uaktualnij limit min;
- ustawienia planszy zastosuj przyciskiem rozpoczynającym nową grę;
- dodaj wybór palety kolorów i regulację głośności;
- przy planszy umieść duży przełącznik dźwięku;
- dźwięk początkowo wyłączony, bez zewnętrznych plików i zależności;
- minihelp ma wyjaśniać liczby, flagi, odkrywanie i warunek wygranej.

Na małym ekranie umieść panel pod grą, a dużą planszę pozwól
przewijać. Zmiana kolorów lub dźwięku nie może resetować gry.
Zachowaj bezpieczne pierwsze odkrycie, tryb flagowania i blokadę
ruchów po końcu gry. Przy zerowej liczbie min pierwsze odkrycie
ma odsłonić całą planszę i zakończyć się wygraną.
Sprawdź przypadki graniczne i podaj zakres wykonanych testów.
```

## Odbiór poprawki

1. Sprawdź 2 × 2 z 0 i 2 minami oraz 30 × 30 z 0 i 450 minami.
2. Dla 9 × 9 przycisk „Standardowa” powinien ustawić 10 min.
3. Zmniejsz bok: limit min powinien się zmniejszyć, a za duża wartość
   powinna zostać obniżona. Zatwierdź i sprawdź nową planszę.
4. Spróbuj wpisać ujemną lub ułamkową liczbę min i rozmiar poza zakresem.
   Formularz powinien uniemożliwić zatwierdzenie.
5. W trakcie gry przełącz kolory: odkryte pola powinny pozostać odkryte.
6. Włącz dźwięk dużym przyciskiem, zmień głośność, wykonaj ruch i wycisz.
7. Na telefonie sprawdź flagowanie i przewijanie większej planszy.

Do powtarzalnej kontroli logiki tej implementacji służy:

```bash
node Test/check-game.cjs
```

Ten test symuluje elementy strony. Nie zastępuje sprawdzenia wyglądu,
natywnej walidacji formularza i odsłuchu w prawdziwej przeglądarce.
