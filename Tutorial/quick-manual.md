---
title: "Saper z Codex"
subtitle: "Środowisko, pierwszy prompt, iteracja"
author: "NCAE_Saper"
date: "22 listopada 2026 · Wersja 1.3"
lang: pl-PL
---

**Quick manual · HTML / CSS / JavaScript**

Dla programistów i administratorów środowisk developerskich.
Polecenia, prompty i kryteria odbioru; bez frameworków i zależności gry.

# Spis treści

- 1. Cel
- 2. Przygotowanie środowiska
- 3. Konfiguracja projektu
- 4. Pierwsze uruchomienie i utworzenie gry
- 5. Drugi prompt: utworzenie testu
- 6. Odbiór wersji zero
- 7. Trzeci prompt: rozbudowa gry

# 1. Cel

Utwórz Sapera w trzech plikach: `index.html`, `style.css`, `script.js`.
Pierwsza iteracja: 9 × 9, 10 min, bezpieczne pierwsze odkrycie, flagi,
odkrywanie pustych obszarów, wygrana/przegrana i restart.
Druga iteracja: konfigurowalna plansza, kolory, dźwięki i minihelp.

Minimalny odbiór: trzy niepuste pliki i poprawne odwołania CSS/JS.
Odbiór funkcjonalny wymaga osobnej próby w przeglądarce.

# 2. Przygotowanie środowiska

## Zakres

Potrzebujesz terminala, przeglądarki, Codex CLI i konta z dostępem do Codex.
Python 3 służy do uruchomienia testu plików. Node.js z npm
jest potrzebny przy wybranej poniżej instalacji Codex przez npm oraz do
kontroli JavaScript.

Zaczynasz w pustym katalogu. Wszystkie pliki gry i testu powstaną w ćwiczeniu.

## Linux — Bash

Sprawdź stan; brak polecenia oznacza brak instalacji lub wpisu w PATH:

```bash
command -v python3 node npm codex
python3 --version
node --version
npm --version
codex --version
```

Zainstaluj tylko braki:

- Python: pakiet `python3` swojej dystrybucji. Debian/Ubuntu:
  `sudo apt update`, potem `sudo apt install python3`.
  Pozostałe warianty: [Python na Unix/Linux](https://docs.python.org/3/using/unix.html).
- Node.js i npm: wybierz wspieraną wersję LTS i instrukcję Linux na
  [oficjalnej stronie Node.js](https://nodejs.org/en/download).
- Codex: po uruchomieniu npm wykonaj `npm install -g @openai/codex`.
  Alternatywne instalatory: [OpenAI — Codex CLI](https://developers.openai.com/codex/cli).
  Przy błędzie uprawnień użyj instalacji Node/npm w katalogu użytkownika.

Ponów kontrolę wersji.

## Windows — PowerShell

Sprawdź polecenia i wersje:

```powershell
Get-Command py, python, node, npm.cmd, codex.cmd -ErrorAction SilentlyContinue
py -3 --version
node --version
npm.cmd --version
codex.cmd --version
```

Jeśli `py` nie istnieje, sprawdź `python --version`. Działający Python 3
może zastąpić `py -3` w dalszych poleceniach. Sam alias otwierający sklep
nie oznacza zainstalowanego interpretera.

Zainstaluj tylko braki:

- Python: [oficjalny Python Install Manager i instrukcja Windows](https://docs.python.org/3/using/windows.html).
  Pobierz go z python.org; po instalacji sprawdź dostępność interpretera.
- Node.js z npm: instalator Windows LTS ze
  [strony Node.js](https://nodejs.org/en/download).
- Otwórz nowy terminal, aby wczytać PATH. Codex:
  `npm.cmd install -g @openai/codex`.
  Szczegóły: [OpenAI — Codex CLI](https://developers.openai.com/codex/cli)
  i [środowisko Windows](https://developers.openai.com/codex/windows).

Użycie `.cmd` wybiera wrapper zamiast skryptu `.ps1`; nie wymaga zmiany
polityki wykonywania PowerShell. Ponów kontrolę wersji.

WSL jest opcją: w nim wykonuj całą ścieżkę Linux, łącznie z instalacją
narzędzi i logowaniem. Nie mieszaj jej z instalacją Windows.

## Pusty katalog projektu

Wybierz katalog nadrzędny i utwórz nowy projekt `Saper`.

Linux (Bash):

```bash
mkdir Saper
cd Saper
mkdir -p .codex Test/game
```

Windows (PowerShell):

```powershell
New-Item -ItemType Directory Saper
Set-Location Saper
New-Item -ItemType Directory .codex, Test/game
```

Od tej chwili wszystkie ścieżki są względne wobec `Saper`.
`Test/game` to przyjęta nazwa katalogu gry, nie plik dostarczany z manualem.

## Opcjonalnie: repozytorium Git

Sprawdź `git --version`. Jeśli brakuje Git, użyj
[oficjalnej instrukcji instalacji](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
W katalogu `Saper` wykonaj `git init`. Commituj samodzielnie:
konfigurację, odebraną wersję zero z testem i przetestowaną rozbudowę.
Jeśli Git poprosi o tożsamość autora, ustaw `user.name` i `user.email`
zgodnie ze swoją konfiguracją. Nie dodawaj poświadczeń ani kluczy API.

# 3. Konfiguracja projektu

## `.codex/config.toml` — ustawienia CLI

Utwórz plik w edytorze. Ścieżka zaczyna się od `.codex`, nie `/codex`.
Wklej:

```toml
approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

Pierwszy wpis pozwala agentowi poprosić o zgodę na operację, drugi ogranicza
zapis do obszaru pracy z wyjątkami chronionych ścieżek. Model wybierzesz
w CLI. Lokalna konfiguracja jest ładowana dla zaufanych projektów;
ustawienia organizacji mogą ją ograniczać, a parametry CLI nadpisywać.
Źródło: [OpenAI — konfiguracja](https://developers.openai.com/codex/config-basic).

## `AGENTS.md` — zasady tworzenia gry

W katalogu głównym `Saper` utwórz plik o dokładnie tej nazwie i wklej:

```markdown
# Projekt Saper

- Twórz grę przeglądarkową w HTML, CSS i JavaScript w Test/game.
- Używaj lokalnych plików index.html, style.css i script.js.
- Bez frameworków, CDN i zewnętrznych zależności gry.
- Gra ma działać po otwarciu index.html w przeglądarce.
- Pisz komunikaty gry i odpowiedzi po polsku, zwięźle.
- Zachowuj działające funkcje przy kolejnych zmianach.
- Test plików w Pythonie utwórz w tests/check_game_files.py,
  gdy użytkownik zleci jego przygotowanie.
- Sprawdzaj zmiany; odróżniaj wykonane testy od proponowanych.
- Nie wykonuj poleceń Git; repozytorium obsługuje użytkownik.
```

Codex czyta instrukcje `AGENTS.md` przed pracą; mogą obowiązywać także
instrukcje nadrzędne. Plik opisuje zadanie, nie przyznaje uprawnień systemowych.
Źródło: [OpenAI — AGENTS.md](https://developers.openai.com/codex/guides/agents-md).

Jeśli używasz Git, opcjonalnie zapisz konfigurację:

```bash
git add .codex/config.toml AGENTS.md
git commit -m "Konfiguracja projektu Saper"
```

# 4. Pierwsze uruchomienie i utworzenie gry

## Start krok po kroku

1. Otwórz terminal w `Saper`. Sprawdź ścieżkę: `pwd` (Linux) lub
   `Get-Location` (PowerShell).
2. Uruchom `codex login status` (Windows: `codex.cmd login status`).
   Jeśli brak logowania, wykonaj `codex login` / `codex.cmd login`
   i dokończ uwierzytelnienie w przeglądarce zgodnie z komunikatami.
3. Uruchom `codex` (Windows: `codex.cmd`). Przy pierwszym uruchomieniu
   może pojawić się konfiguracja konta, pytanie o zaufanie do katalogu
   lub konfiguracja sandboxa Windows. Potwierdź własny katalog `Saper`;
   komunikat instalacji sandboxa dotyczy środowiska wykonywania poleceń.
   Jeśli konfiguracja Windows nie powiedzie się, skorzystaj z
   [instrukcji OpenAI](https://developers.openai.com/codex/windows).
4. W polu rozmowy wpisz `/status`. Sprawdź model, katalog/obszar zapisu
   i politykę zatwierdzania. Jeśli projekt nie jest zaufany, lokalna
   konfiguracja może zostać pominięta; rozwiąż to przed generowaniem gry.
5. Wpisz `/model`, wybierz dostępny na Twoim koncie model i zatwierdź.
   Sprawdź wybór ponownie przez `/status`. Nie musisz wpisywać nazwy
   modelu do konfiguracji projektu.
6. Wklej pierwszy prompt poniżej. Poczekaj na końcowe podsumowanie.
   Jeśli CLI poprosi o zgodę, przeczytaj polecenie i zakres działania;
   zatwierdź operację potrzebną do zadania.

Poniżej schemat oczekiwanych informacji, nie dosłowny zapis ekranu.
Nazwy, kolejność i treść komunikatów zależą od wersji oraz ustawień:

```text
Uruchomienie → logowanie lub aktywne konto
Zaufanie do katalogu → sprawdź ścieżkę Saper
/status → model, polityka zgód, obszary zapisu, użycie kontekstu
/model → lista modeli dostępnych dla konta
Prompt → postęp pracy, ewentualne zgody, podsumowanie zmian
```

Polecenia z `/` wpisujesz w rozmowie Codex, nie w Bash/PowerShell.
Wpisanie samego `/` pokazuje dostępne komendy. `/quit` kończy CLI;
`codex resume --last` (Windows: `codex.cmd resume --last`) wznawia
ostatnią rozmowę. Komendy opisuje
[oficjalna dokumentacja CLI](https://developers.openai.com/codex/cli/slash-commands).

## Prompt 1 — gra

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

Po zakończeniu oczekuj plików `Test/game/index.html`, `style.css`
i `script.js` oraz listy faktycznie wykonanych kontroli.
Sam komunikat o sukcesie nie zastępuje sprawdzenia plików.

# 5. Drugi prompt: utworzenie testu

## Prompt 2 — test plików

W tej samej rozmowie przekaż kolejne zadanie. Skrypt jeszcze nie istnieje:
teraz ma go utworzyć Codex.

```text
Utwórz tests/check_game_files.py w Pythonie 3, bez dodatkowych bibliotek.
Nie zmieniaj gry. Test ma działać na Linux i Windows, niezależnie
od bieżącego katalogu: ustal katalog projektu względem __file__.
Sprawdź, czy Test/game/index.html, style.css i script.js istnieją
oraz są niepuste. Użyj html.parser do sprawdzenia, czy HTML ładuje
style.css jako arkusz stylów i script.js jako skrypt (dopuść ./).
Przy sukcesie wypisz OK dla plików i SUKCES; zakończ kodem 0.
Przy błędzie wypisz czytelny komunikat i zakończ kodem różnym od 0.
Nie używaj assert do kontroli wejścia. Utwórz katalog tests, jeśli nie ma.
Uruchom test i podaj wynik. Sprawdź też, na tymczasowych kopiach,
czy wykrywa brak pliku, pusty plik i błędne odwołanie w HTML.
Nie usuwaj ani nie uszkadzaj właściwych plików gry podczas testowania.
```

## Uruchomienie przez czytelnika

Otwórz drugi terminal w `Saper` albo zakończ CLI przez `/quit`.
Sprawdź obecność nowego pliku, następnie uruchom:

Linux: `python3 tests/check_game_files.py`.
Windows: `py -3 tests/check_game_files.py`.

Oczekiwany wynik zgodny z wymaganiami promptu:

```text
OK: Test/game/index.html
OK: Test/game/style.css
OK: Test/game/script.js
SUKCES
```

Sprawdź też `node --check Test/game/script.js`: kod zakończenia 0 oznacza
poprawną składnię. Test plików i składni nie sprawdza zachowania gry.
Jeśli pliku testu brakuje, wróć do Codex i poproś o zapisanie go,
przekazując komunikat błędu. Nie przechodź dalej z niewykonaną kontrolą.

# 6. Odbiór wersji zero

Otwórz `Test/game/index.html` w przeglądarce. Sprawdź:

- planszę 9 × 9 i bezpieczne pierwsze odkrycie;
- flagę prawym przyciskiem oraz tryb flagowania dla dotyku;
- blokadę odkrywania oflagowanego pola i odkrywanie pustych obszarów;
- przegraną po trafieniu miny, wygraną po odkryciu pól bez min;
- blokadę ruchów po końcu gry oraz reset przyciskiem „Nowa gra”;
- układ na małym ekranie.

Przy błędzie podaj Codex kroki odtworzenia, wynik i oczekiwanie:

```text
Po postawieniu flagi zwykłe kliknięcie nadal odkrywa pole.
Zablokuj odkrywanie oflagowanego pola. Zachowaj możliwość usunięcia
flagi. Sprawdź zmianę i ponownie uruchom test plików.
```

Wykonaj do dwóch iteracji naprawczych i powtarzaj kontrolę po każdej.
Jeśli problem zostaje, zapisz błąd i jego przyczynę zamiast uznawać odbiór.

Po udanym teście i próbie ręcznej zapisz działającą wersję zero.
Jeśli używasz Git (zalecane):

```bash
git add Test/game tests/check_game_files.py
git commit -m "Saper: dzialajaca wersja zero i test plikow"
```

Bez Git zachowaj kopię katalogu projektu przed dalszą rozbudową.

# 7. Trzeci prompt: rozbudowa gry

Obejrzyj działającą grę. Załóżmy, że chcesz teraz zmieniać rozmiar planszy,
liczbę min i kolory oraz mieć pod ręką minihelp i przełącznik dźwięku.
Doprecyzuj wymagania w kolejnym prompcie. Przyjmijmy bok 2–30 pól
oraz preset min 10/81 pól; to nasza reguła, nie uniwersalny standard Sapera.

## Prompt 3 — druga iteracja gry

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


Ponownie uruchom test z rozdziału 5 i kontrolę składni JavaScript.
Po udanej kontroli ręcznej opcjonalnie zapisz kolejną wersję:

```bash
git add Test/game
git commit -m "Saper: ustawienia, minihelp i dzwiek"
```
