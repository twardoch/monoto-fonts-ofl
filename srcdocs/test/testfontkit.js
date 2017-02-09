#! /usr/bin/env node
// https://github.com/tannerhodges/fontfeatures/blob/master/bin/fontfeatures.js

var path = process.argv[2]

if (!path) {
  throw 'Whoops! We need a font to check: `fontfeatures [PATH_TO_FONT]`'
}

var fontkit = require('fontkit')
var font = fontkit.openSync(path)

console.log('<html>')

console.log('<h3>adjustypo.js</h3>')

// Basic Info
console.log('<h1>' + font.postscriptName + '</h1>')
console.log('<p>  <strong>' + font.version + '</strong> ')
console.log(' with ' + font.numGlyphs + ' glyphs</p>')

// Dimensions
console.log('<h2>Dimensions</h2>')
console.log('  <ul class="adjustypo adjustypo-dimension">')

// Font size
console.log('    <li class="adjustypo adjustypo-dimension-font-size">')
console.log('      <input type="range" id="adjustypo_dimension_font_size" value="16" min="8" max="64" step="0.01" />')
console.log('      <label for="adjustypo_dimension_font_size">Font size</label>')
console.log('    </li>')

// Line height
var cssLineHeight = 1.2
var font_OS2 = font['OS/2']
if (font_OS2) {
  cssLineHeight = (font_OS2.typoAscender - font_OS2.typoDescender + font_OS2.typoLineGap) / font.head.unitsPerEm
} else {
  var font_hhea = font['hhea']
  cssLineHeight = (font_hhea.ascent - font_hhea.desent + font_hhea.lineGap) / font.head.unitsPerEm
}
console.log('    <li class="adjustypo adjustypo-dimension-line-height">')
console.log('      <input type="range" id="adjustypo_dimension_line_height" value="' + cssLineHeight + '" min="0.5" max="2.5" step="0.01" />')
console.log('      <label for="adjustypo_dimension_line_height">Line height</label>')
console.log('    </li>')

// Letter spacing
console.log('    <li class="adjustypo adjustypo-dimension-letter-spacing">')
console.log('      <input type="range" id="adjustypo_dimension_letter_spacing" value="-1" min="0" max="1" step="0.01" />')
console.log('      <label for="adjustypo_dimension_letter_spacing">Letter spacing</label>')
console.log('    </li>')

console.log('  </ul>')

// OpenType Variation Axes
console.log('<h2>Variations</h2>')

var fontAxes = font.variationAxes
console.log('  <ul class="adjustypo adjustypo-variation">')
var cssVariationSettings = 'font-variation-settings: '
for (var fontAxis in fontAxes) {
  fontAxisName = fontAxes[fontAxis]['name']
  fontAxisMin = fontAxes[fontAxis]['min']
  fontAxisDflt = fontAxes[fontAxis]['default']
  fontAxisMax = fontAxes[fontAxis]['max']
  cssVariationSettings += '"' + fontAxis + '" ' + fontAxisDflt + ', '
  console.log('    <li class="adjustypo adjustypo-variation-' + fontAxis + '">')
  console.log('      <input type="range" id="adjustypo_variation_' + fontAxis + '" value="' + fontAxisDflt + '" min="' + fontAxisMin + '" max="' + fontAxisMax + '" step="0.01" />')
  console.log('      <label for="adjustypo_variation_' + fontAxis + '">' + fontAxisName + '</label>')
  console.log('    </li>')
}

cssVariationSettings = cssVariationSettings.slice(0, -2) + ';'
console.log('  </ul>')
console.log('')
console.log('')

// OpenType Layout Features
console.log('<h2>Features</h2>')

var otFeaturesDefault = ['calt', 'ccmp', 'clig', 'curs', 'kern', 'liga', 'locl', 'mark', 'mkmk', 'rclt', 'rlig']
var otFeaturesShowable = ['afrc', 'c2pc', 'c2sc', 'calt', 'case', 'ccmp', 'clig', 'cpsp', 'cswh', 'curs', 'dlig', 'dnom', 'expt', 'falt', 'frac', 'fwid', 'halt', 'hist', 'hlig', 'hngl', 'hojo', 'hwid', 'ital', 'jalt', 'jp04', 'jp78', 'jp83', 'jp90', 'kern', 'liga', 'lnum', 'locl', 'mark', 'mgrk', 'mkmk', 'nalt', 'nlck', 'numr', 'onum', 'ordn', 'ornm', 'palt', 'pcap', 'pkna', 'pnum', 'pwid', 'qwid', 'rand', 'rclt', 'rlig', 'ruby', 'rvrn', 'salt', 'sinf', 'smcp', 'smpl', 'subs', 'sups', 'swsh', 'titl', 'tnam', 'tnum', 'trad', 'twid', 'unic', 'vhal', 'vpal', 'zero', 'ss01', 'ss02', 'ss03', 'ss04', 'ss05', 'ss06', 'ss07', 'ss08', 'ss09', 'ss10', 'ss11', 'ss12', 'ss13', 'ss14', 'ss15', 'ss16', 'ss17', 'ss18', 'ss19', 'ss20']
var fontFeatures = font.availableFeatures

console.log('  <ul class="adjustypo adjustypo-feature">')
console.log('    <li class="adjustypo adjustypo-uppercase">')
console.log('      <input type="checkbox" id="adjustypo_uppercase" />')
console.log('      <label for="adjustypo_uppercase">CASE</label>')
console.log('    </li>')

var cssFeatureSettings = 'font-feature-settings: '
for (var i = 0; i < fontFeatures.length; i++) {
  var fontFeature = fontFeatures[i]
  var isFeatureShowable = otFeaturesShowable.indexOf(fontFeature) > -1
  if (isFeatureShowable) {
    var isFeatureDefault = otFeaturesDefault.indexOf(fontFeature) > -1
    cssFeatureSettings += '"' + fontFeature + '" ' + ((isFeatureDefault) ? '1' : '0') + ', '
    console.log('    <li class="adjustypo adjustypo-feature-' + fontFeature + '">')
    console.log('      <input type="checkbox" id="adjustypo_feature_' + fontFeature + '"' + ((isFeatureDefault) ? ' checked="checked"' : '') + ' />')
    console.log('      <label for="adjustypo_feature_' + fontFeature + '">' + fontFeature + '</label>')
    console.log('    </li>')
  }
}
cssFeatureSettings = cssFeatureSettings.slice(0, -2) + ';'
console.log('  </ul>')
console.log('')
console.log('')

console.log('<pre><code class="css">')
console.log('  font-size: 16px;')
console.log('  line-height: ' + cssLineHeight + 'em;')
console.log('  letter-spacing: 0em;')
console.log('  ' + cssVariationSettings + '')
console.log('  text-transform: normal;')
console.log('  ' + cssFeatureSettings + '')
console.log('</code></pre>')

console.log('</html>')
