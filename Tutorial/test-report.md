# Raport próby poradnika 1.0

Data: 22 listopada 2026.

## Sposób wykonania

Najpierw opracowano poradnik i uruchomiono jego generator dokumentów.
Następnie agent w bieżącej sesji wykonał polecenie z rozdziału 2:
utworzył grę w `Test/game`. Nie uruchamiano osobnej sesji modelu.
Polecenie kontrolne z rozdziału 3 wyodrębniono bezpośrednio z Markdown
poradnika i wykonano w Bash, w katalogu głównym projektu.

## Wynik pierwszej próby

```text
OK: Test/game/index.html
OK: Test/game/style.css
OK: Test/game/script.js
SUKCES: trzy pliki i poprawne odwolania CSS/JS
```

`node --check Test/game/script.js` zakończył się kodem 0.
Minimalny cel użytkownika został osiągnięty za pierwszym razem.
Liczba iteracji naprawczych: 0 (limit: 2).

## Zakres potwierdzenia

Potwierdzono obecność niepustych plików HTML/CSS/JS, lokalne odwołania
w HTML i poprawność składni JavaScript. Wygenerowano ODT oraz PDF.
Tekst PDF sprawdzono narzędziem pdftotext, a liczbę stron przez pdfinfo.

Nie wykonano testów interakcji w prawdziwej przeglądarce ani oceny wizualnej
PDF/ODT. Zasady gry i układ mobilny wymagają jeszcze kontroli ręcznej opisanej
w rozdziale 4. Sukces tej próby nie oznacza pełnego odbioru funkcjonalnego gry.
