#cssrgb
_Generates a list of RGB colors on a CSS file and provides CSV output_

## Install
`npm -g cssrgb`

## Usage

Call `cssrgb` with as many css URLs as you want. Minimum is 1 URL

```bash
cssrgb http://your-domain.com/css/yourcss.css [http://your-domain.com/css/another.css http://your-domain.com/css/yet_another.css]`
```

## What is it?
`cssrgb` is a small package that:

- Analyses a given CSS url
- Parses all colors in hexadecimal
- Converts the `#hex` colors to `RGB`
- Generates a `CSV` file with the following format:

```csv
"r","g","b"
"242","246","250"
"255","187","57"
"255","202","86"
...
```

This output is used to generate color charts by RGB proximity, like this:

![Color bar](http://i.imgur.com/31sTRiP.png)

This is the first step of this project, next iteration will be to generate html output with this proximity algorithm, instead of only `csv`

## Why?
It's common in big CSS files to have slight variations of colors, what can pollute the styles. Usually result of using color picker to get a color value instead of reusing what was already available. 

The idea of this project is to first map out used colors by visual proximity, and in a second step replace them by a standart one, making the CSS consistent.


## Ideas? Suggestions?

Feel free to fork and do pull requests, or open an issue here.