<!-- include ../../assets/tpl/header.md -->

<!-- toc -->

## About

{{pkg.description}}

All unit definitions & conversions are based on the SI unit system & concepts
described here:

- https://en.wikipedia.org/wiki/International_System_of_Units
- https://en.wikipedia.org/wiki/SI_base_unit
- https://en.wikipedia.org/wiki/SI_derived_unit
- https://en.wikipedia.org/wiki/Coherence_(units_of_measurement)
- https://en.wikipedia.org/wiki/Metric_prefix

The overall conversion approach is based on [@g7s/unit](https://github.com/g7s/unit).

### Unit definitions

Each unit is defined via a 7-dimensional vector representing individual
exponents for each of the [SI base unit
dimensions](https://en.wikipedia.org/wiki/SI_base_unit), in order:

| id | SI dimension        | Base unit | Base unit symbol |
|----|---------------------|-----------|------------------|
| 0  | mass                | kilogram  | kg               |
| 1  | length              | meter     | m                |
| 2  | time                | second    | s                |
| 3  | current             | ampere    | A                |
| 4  | temperature         | kelvin    | K                |
| 5  | amount of substance | mole      | mol              |
| 6  | luminous intensity  | candela   | cd               |

Dimensionless units (e.g. radian, byte) are supported too and represented by a
vector with all dimensions set to zero.

Additionally, we also define a scale factor and zero offset for each unit, with
most dimensions' base units usually using a factor of 1 and no offset.

For example, here's how we can define kilograms and meters:

```ts
// kilogram, SI dimension 0
const KG = coherent(1);
// { dim: [ 1, 0, 0, 0, 0, 0, 0 ], scale: 1, offset: 0, coherent: true }

// meters, SI dimension 1
const M = coherent(1);
// { dim: [ 0, 1, 0, 0, 0, 0, 0 ], scale: 1, offset: 0, coherent: true }

// kelvin, SI dimension 4 (here without syntax sugar)
const K = unit(4, 1, 0, true);
// { dim: [ 0, 0, 0, 0, 1, 0, 0 ], scale: 1, offset: 0, coherent: true }

// fahrenheit, SI dim 4 with custom scale factor and zero offset
const F = unit(4, 1 / 1.8, 459.67 / 1.8);
// { dim: [ 0, 0, 0, 0, 1, 0, 0 ],  scale: 0.5555, offset: 255.3722, coherent: false }
```

More complex units like electrical resistance (e.g. ohm) are based on more than
a single dimension:

```ts
// ohm = volt / ampere
div(V, A)
// { dim: [ 1, 2, -3, -2, 0, 0,  0 ], scale: 1, offset: 0, coherent: true }
```

This dimension vector represents the unit definition for (see [SI derived
units](https://en.wikipedia.org/wiki/SI_derived_unit)):

> Ω = kg⋅m<sup>2</sup>⋅s<sup>−3</sup>⋅A<sup>−2</sup>

Btw. The [`formatSI()`]() function can be used to format a unit's dimension
vector:

```ts
formatSI(div(V, A));
// "kg·m2·s-3·A-2"
```

### Predefined units

The following units are provided as "builtins", here grouped by dimension:

#### Acceleration

| Unit name | Variable name | Description               |
|-----------|---------------|---------------------------|
| `m/s2`    | `m_s2`        | meter per second squared  |
| `ft/s2`   | `ft_s2`       | foot per second squared   |
| `rad/s2`  | `rad_s2`      | radian per second squared |
| `g0`      | `g0`          | standard gravity          |

#### Angle

| Unit name | Variable name | Description |
|-----------|---------------|-------------|
| `arcmin`  | `arcmin`      | arc minute  |
| `arcsec`  | `arcsec`      | arc second  |
| `deg`     | `deg`         | degree      |
| `gon`     | `gon`         | gradian     |
| `rad`     | `rad`         | radian      |
| `sr`      | `sr`          | steradian   |
| `turn`    | `turn`        | turn        |

#### Area

| Unit name | Variable name | Description       |
|-----------|---------------|-------------------|
| `m2`      | `m2`          | square meter      |
| `cm2`     | `cm2`         | square centimeter |
| `mm2`     | `mm2`         | square millimeter |
| `km2`     | `km2`         | square kilometer  |
| `ha`      | `ha`          | hectar            |
| `ac`      | `ac`          | acre              |
| `sqin`    | `sqin`        | square inch       |
| `sqft`    | `sqft`        | square foot       |
| `sqmi`    | `sqmi`        | square mile       |

#### Data

| Unit name | Variable name | Description       |
|-----------|---------------|-------------------|
| `bit`     | `bit`         | bit               |
| `kbit`    | `kbit`        | kilobit           |
| `Mbit`    | `Mbit`        | megabit           |
| `Gbit`    | `Gbit`        | gigabit           |
| `Tbit`    | `Tbit`        | terabit           |
| `kibit`   | `kibit`       | kibibit (1024)    |
| `Mibit`   | `Mibit`       | mebibit (1024)    |
| `Gibit`   | `Gibit`       | gibibit (1024)    |
| `Tibit`   | `Tibit`       | tebibit (1024)    |
| `B`       | `B`           | byte (8 bit)      |
| `kB`      | `kB`          | kilobyte (metric) |
| `MB`      | `MB`          | megabyte (metric) |
| `GB`      | `GB`          | gigabyte (metric) |
| `TB`      | `TB`          | terabyte (metric) |
| `PB`      | `PB`          | petabyte (metric) |
| `EB`      | `EB`          | exabyte (metric)  |
| `KiB`     | `KiB`         | kibibyte (1024)   |
| `MiB`     | `MiB`         | mebibyte (1024)   |
| `GiB`     | `GiB`         | gibibyte (1024)   |
| `TiB`     | `TiB`         | tebibyte (1024)   |
| `PiB`     | `PiB`         | pebibyte (1024)   |
| `EiB`     | `EiB`         | exbibyte (1024)   |

#### Electric current

| Unit  | Variable name | Description       |
|-------|---------------|-------------------|
| `A`   | `A`           | ampere            |
| `mA`  | `mA`          | milliampere       |
| `mAh` | `mAh`         | milliampere-hours |
| `C`   | `C`           | coulomb           |
| `V`   | `V`           | volt              |
| `mV`  | `mV`          | millivolt         |
| `kV`  | `kV`          | kilovolt          |
| `MV`  | `MV`          | megavolt          |
| `F`   | `F`           | farad             |
| `pF`  | `pF`          | picofarad         |
| `µF`  | `µF`          | microfarad        |
| `Ω`   | `Ω` / `ohm`   | ohm               |
| `kΩ`  | `kΩ` / `kohm` | kiloohm           |
| `MΩ`  | `MΩ` / `Mohm` | megaohm           |
| `GΩ`  | `GΩ` / `Gohm` | gigaohm           |
| `S`   | `S`           | siemens           |
| `Wb`  | `Wb`          | weber             |
| `T`   | `T`           | tesla             |
| `H`   | `H`           | henry             |

#### Energy

| Unit   | Variable name | Description |
|--------|---------------|-------------|
| `J`    | `J`           | joule       |
| `kJ`   | `kJ`          | kilojoule   |
| `MJ`   | `MJ`          | megajoule   |
| `GJ`   | `GJ`          | gigajoule   |
| `cal`  | `cal`         | calorie     |
| `kcal` | `kcal`        | kilocalorie |

#### Force

| Unit | Variable name | Description |
|------|---------------|-------------|
| `N`  | `N`           | newton      |

#### Frequency

| Unit  | Variable name | Description         |
|-------|---------------|---------------------|
| `Hz`  | `Hz`          | hertz               |
| `kHz` | `KHz`         | kilohertz           |
| `MHz` | `MHz`         | megahertz           |
| `GHz` | `GHz`         | gigahertz           |
| `THz` | `THz`         | terahertz           |
| `rpm` | `rpm`         | rotation per minute |
| `ω`   | `ω` / `omega` | radian per second   |

#### Length

| Unit name | Variable name  | Description       |
|-----------|----------------|-------------------|
| `m`       | `m`            | meter             |
| `Å`       | `angstrom`     | angstrom          |
| `nm`      | `nm`           | nanometer         |
| `µm`      | `µm`           | micrometer        |
| `mm`      | `mm`           | millimeter        |
| `cm`      | `cm`           | centimeter        |
| `km`      | `km`           | kilometer         |
| `au`      | `au`           | astronomical unit |
| `pc`      | `pc`           | parsec            |
| `ly`      | `ly`           | light year        |
| `in`      | `in`           | inch              |
| `mil`     | `mil` / `thou` | 1/1000th inch     |
| `ft`      | `ft`           | foot              |
| `yd`      | `yd`           | yard              |
| `mi`      | `mi`           | mile              |
| `nmi`     | `nmi`          | nautical mile     |
| `pica`    | `pica`         | pica              |
| `point`   | `point`        | point             |

#### Luminous intensity

| Unit | Variable name | Description |
|------|---------------|-------------|
| `cd` | `cd`          | candela     |
| `lm` | `lm`          | lumen       |
| `lx` | `lx`          | lux         |

#### Mass

| Unit name | Variable name | Description    |
|-----------|---------------|----------------|
| `µg`      | `µg`          | microgram      |
| `mg`      | `mg`          | milligram      |
| `g`       | `g`           | gram           |
| `kg`      | `kg`          | kilogram       |
| `t`       | `t`           | tonne          |
| `kt`      | `kt`          | kilotonne      |
| `Mt`      | `Mt`          | megatonne      |
| `Gt`      | `Gt`          | gigatonne      |
| `lb`      | `lb`          | imperial pound |
| `st`      | `st`          | stone          |

#### Parts per notation

https://en.wikipedia.org/wiki/Parts-per_notation

| Unit name | Variable name | Description                    |
|-----------|---------------|--------------------------------|
| `%`       | `percent`     | part per hundred               |
| `‰`       | `permille`    | part per thousand              |
| `‱`       | `permyriad`   | part per ten thousand          |
| `pcm`     | `pcm`         | part per cent hundred thousand |
| `ppm`     | `ppm`         | part per million               |
| `ppb`     | `ppb`         | part per billion               |
| `ppt`     | `ppt`         | part per trillion              |

#### Power

| Unit name | Variable name | Description   |
|-----------|---------------|---------------|
| `W`       | `W`           | watt          |
| `mW`      | `mW`          | milliwatt     |
| `kW`      | `kW`          | kilowatt      |
| `MW`      | `MW`          | megawatt      |
| `GW`      | `GW`          | gigawatt      |
| `TW`      | `TW`          | terawatt      |
| `Wh`      | `Wh`          | watt-hour     |
| `kWh`     | `kWh`         | kilowatt-hour |

#### Pressure

| Unit name | Variable name | Description           |
|-----------|---------------|-----------------------|
| `Pa`      | `Pa`          | pascal                |
| `kPa`     | `KPa`         | kilopascal            |
| `MPa`     | `MPa`         | megapascal            |
| `GPa`     | `GPa`         | gigapascal            |
| `at`      | `at`          | technical atmosphere  |
| `atm`     | `atm`         | atmosphere            |
| `bar`     | `bar`         | bar                   |
| `psi`     | `psi`         | pound per square inch |

#### Speed

| Unit   | Variable name | Description        |
|--------|---------------|--------------------|
| `m/s`  | `m_s`         | meter per second   |
| `km/h` | `km_h`        | kilometer per hour |
| `mph`  | `mph`         | mile per hour      |
| `kn`   | `kn`          | knot               |

#### Substance

| Unit  | Variable name | Description |
|-------|---------------|-------------|
| `mol` | `mol`         | mole        |

#### Temperature

| Unit | Variable name | Description       |
|------|---------------|-------------------|
| `K`  | `K`           | kelvin            |
| `℃`  | `celsius`     | degree celsius    |
| `℉`  | `fahrenheit`  | degree fahrenheit |

#### Time

| Unit    | Variable name | Description        |
|---------|---------------|--------------------|
| `s`     | `s`           | second             |
| `ms`    | `ms`          | millisecond        |
| `µs`    | `µs`          | microsecond        |
| `ns`    | `ns`          | nanosecond         |
| `min`   | `min`         | minute             |
| `h`     | `h`           | hour               |
| `d`     | `d`           | day                |
| `week`  | `week`        | week               |
| `month` | `month`       | month (30 days)    |
| `year`  | `year`        | year (365.25 days) |

#### Volume

| Unit       | Variable name | Description          |
|------------|---------------|----------------------|
| `m3`       | `m3`          | cubic meter          |
| `mm3`      | `mm3`         | cubic millimeter     |
| `cm3`      | `cm3`         | cubic centimeter     |
| `km3`      | `km3`         | cubic kilometer      |
| `l`        | `l`           | liter                |
| `cl`       | `cl`          | centiliter           |
| `ml`       | `ml`          | milliliter           |
| `gal`      | `gal`         | imperial gallon      |
| `pt`       | `pt`          | imperial pint        |
| `fl oz`    | `floz`        | imperial fluid ounce |
| `us gal`   | `us_gal`      | US gallon            |
| `us pt`    | `us_pt`       | US pint              |
| `us cup`   | `us_cup`      | US cup               |
| `us fl oz` | `us_floz`     | US fluid ounce       |

### Creating & deriving units

#### Using standard metric prefixes

Existing [coherent units]() can be
[prefixed](https://docs.thi.ng/umbrella/units/functions/prefix-1.html) to produce
derived versions:

```ts
// define micrometer (also available as preset)
prefix("µ", "m")
// { dim: [ 0, 1, 0, 0, 0, 0, 0 ], scale: 0.000001, offset: 0, coherent: false }

// define kKhz
prefix("k", Hz);
// { dim: [ 0, 0, -1, 0, 0, 0, 0 ], scale: 1000, offset: 0, coherent: false }
```

#### Unit combinators

The following combinators can be used to derive scaled and/or more complex units
in multiple SI dimensions:

- [`div(a, b)`](https://docs.thi.ng/umbrella/units/functions/div.html): derives
  a new unit via the division of the given units
- [`mul(a, b)`](https://docs.thi.ng/umbrella/units/functions/mul.html): derives
  a new unit as the product of the given units
- [`pow(u, k)`](https://docs.thi.ng/umbrella/units/functions/pow.html): raises
  given unit to power `k` (e.g. meter ⇒ square meter)
- [`reciprocal(u)`](https://docs.thi.ng/umbrella/units/functions/reciprocal.html):
  Creates reciprocal of given unit (e.g. Hz ⇒ 1/second)

```ts
// acceleration (meter per second squared)
const m_s2 = div(m, pow(s, 2));
// { dim: [ 0, 1, -2, 0, 0, 0,  0 ], scale: 1, offset: 0, coherent: false }

// define kilowatt-hour (also available as preset)
const kWh = mul(prefix("k","W"), "h");
// { dim: [ 1, 2, -2, 0, 0, 0, 0 ], scale: 3600000, offset: 0, coherent: false }

// define `word` as 16 bits
const word = mul(bit, 16);
// { dim: [ 0, 0, 0, 0, 0, 0, 0 ], scale: 16, offset: 0, coherent: false }

// Hz = 1/s
const Hz = reciprocal(s);
// { dim: [ 0, 0, -1, 0, 0, 0, 0 ], scale: 1, offset: 0, coherent: false }
```

### Unit conversions

Only units with compatible (incl. reciprocal) dimensions can be converted,
otherwise an error will be thrown. All dimensionless units can be converted
to other dimensionless units (even if it would be semantic nonsense).

Units can be specified in various ways:

```ts
// convert from km/h to mph using unit names
convert(100, "km/h", "mph");
// 62.13711922373341

// or using predefined unit constants directly
convert(60, mph, km_h);
// 96.56063999999998

// or using anonymous units (meter/second ⇒ yard/hour)
convert(1, "m/s", div(yd, h));
// 3937.007874015749

// convert into opposite direction (meter/second  ⇒ second/meter)
convert(10, "m/s", reciprocal("m/s"));
// 0.1
```

Another example using dimensionless units (here angles, arc second ⇒ radian) to
compute the distance of 10 arcsec on the earth surface (in meters):

```ts
const R = 6371000; // earth radius in meters

convert(10, "arcsec", "rad") * R;
// 308.87479623488537
```

{{meta.status}}

{{repo.supportPackages}}

{{repo.relatedPackages}}

{{meta.blogPosts}}

## Installation

{{pkg.install}}

{{pkg.size}}

## Dependencies

{{pkg.deps}}

{{repo.examples}}

## API

{{pkg.docs}}

<!-- include ../../assets/tpl/footer.md -->