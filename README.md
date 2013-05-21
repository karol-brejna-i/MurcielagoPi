MurcielagoPi
============

Repozytorium "projektu" polegającego na wykorzystaniu Raspberry Pi do zdalnego sterowania zabawkowym samochodzikiem Lamborgini Murcielago. 

Zaplanowaliśmy w pierwszej kolejności zintegrować Raspberry Pi z pilotem samochodu. Pi będzie symulowało działanie mechanicznych kontrolek (kierownica, dźwignia przód/tył), ale do samej transmisji radiowej zostanie wykorzystana elektronika samochodu. W ten sposób uzyskamy możliwość sterowania samochodem przez Raspberry pracujące "stacjonarnie" - wpięte do zasilania i do sieci. [done]

Drugim krokiem jest utworzenie strony WWW, z poziomu której możliwe będzie sterowanie (tej właśnie strony). Bez tego, sterowanie odbywa się przy pomocy skryptu lub "ręcznie" wydawanych komend. [In progress]

Trzecim krokiem będzie "umobilnienie" Raspberry Pi. Planujemy zaopatrzyć go w przenośne źródło zasilania, antenę wi-fi i przytwierdzić do samochodu. W tej konfiguracji do Pi podłączyć możemy dalsze urządzenia, np. detektory, czy kamerkę internetową. Pozwoli to na transmitowanie sygnału (np. streaming video z przejazdu.) lub zaprogramowanie autonomicznej logiki sterowania (np. automatyczne ztrzymywanie się przed przeszkodą, itp.). [Planned]


Strona WWW
-----------
W gałęzi MurcielagoPiWeb znajduje się kod strony WWW, która pozwala na zdalne sterowanie samochodzikiem.

