#!/usr/bin/env python


class GlyphsProjectGenerator:
    def __init__(self):
        self.fam = "Monoto"
        self.folder = "otf"

        self.projs = {
            "Monoto-MM": {"italic": ""},
        }

        self.custs = {
            0: "",
        }

        self.wghts = {
            26: ["100 Th", "Thin"],
            42: ["200 ExLt", "ExtraLight"],
            66: ["300 Lt", "Light"],
            90: ["400 Rg", ""],
            105: ["500 Md", "Medium"],
            121: ["600 SmBd", "SemiBold"],
            141: ["700 Bd", "Bold"],
            164: ["800 ExBd", "ExtraBold"],
            190: ["900 Blk", "Black"],
        }

        self.wdths = {
            60: ["1 UlCd", "Ultra Condensed"],
            67: ["2 ExCd", "Extra Condensed"],
            80: ["3 Cd", "Condensed"],
            90: ["4 SmCd", "SemiCondensed"],
            100: ["5 No", ""],
            120: ["6 SmWd", "Semi Expanded"],
            133: ["7 Wd", "Expanded"],
            147: ["8 ExWd", "Extra Expanded"],
            160: ["9 UlWd", "Extra Expanded"],
        }

    def makeGInstance(self, cust, wdth, wght, italic):
        l = []
        l.append("{   customParameters = (")
        l.append("    {   name = preferredFamilyName;")
        l.append(
            f'        value = "{self.fam} {self.custs[cust]}{self.wdths[wdth][0]}"; }},'
        )
        l.append("    {   name = preferredSubfamilyName;")
        l.append(f'        value = "{self.wghts[wght][0]}{italic}"; }}')
        l.append("    );")
        l.append(f"    interpolationCustom = {cust:d};")
        l.append(f"    interpolationWeight = {wght:d};")
        l.append(f"    interpolationWidth = {wdth:d};")
        # if len(italic):
        #    l.append("    isItalic: true".format())
        # else:
        #    l.append("    isItalic: false".format())
        l.append(
            f'    name = "{self.custs[cust]}{self.wdths[wdth][0]} {self.wghts[wght][0]}{italic}";'
        )
        if len(self.wghts[wght][1]):
            l.append(f"    weightClass = {self.wghts[wght][1]};")
        if len(self.wdths[wdth][1]):
            l.append(f'    widthClass = "{self.wdths[wdth][1]}";')
        l.append("    },")
        return l

    def makeGProlog(self, proj, fmt):
        l = []
        l.append("(")
        return l

    def makeGEpilog(self, proj, fmt):
        l = []
        l.append(")")
        return l

    def makeYamlInstance(self, cust, wdth, wght, italic):
        l = []
        l.append("-   customParameters:")
        l.append("    -   name: preferredFamilyName")
        l.append(f"        value: {self.fam} {self.custs[cust]}{self.wdths[wdth][0]}")
        l.append("    -   name: preferredSubfamilyName")
        l.append(f"        value: {self.wghts[wght][0]}{italic}")
        l.append(f"    interpolationCustom: {cust:.1f}")
        l.append(f"    interpolationWeight: {wght:.1f}")
        l.append(f"    interpolationWidth: {wdth:.1f}")
        if len(italic):
            l.append("    isItalic: true")
        else:
            l.append("    isItalic: false")
        l.append(
            f"    name: {self.custs[cust]}{self.wdths[wdth][0]} {self.wghts[wght][0]}{italic}"
        )
        if len(self.wghts[wght][1]):
            l.append(f"    weightClass: {self.wghts[wght][1]}")
        if len(self.wdths[wdth][1]):
            l.append(f"    widthClass: {self.wdths[wdth][1]}")
        return l

    def makeYamlProlog(self, proj, fmt):
        l = []
        l.append(f"exportPath: {fmt}")
        l.append(f"fontPath: {proj}.glyphs")
        l.append("instances:")
        return l

    def makeYamlProject(self, proj, italic):
        l = []
        i = []
        l += self.makeYamlProlog(proj, self.folder)
        i += self.makeGProlog(proj, self.folder)
        for cust in sorted(self.custs.keys()):
            for wdth in sorted(self.wdths.keys()):
                for wght in sorted(self.wghts.keys()):
                    l += self.makeYamlInstance(cust, wdth, wght, italic)
                    i += self.makeGInstance(cust, wdth, wght, italic)
        i += self.makeGEpilog(proj, self.folder)
        return l, i

    def makeProject(self, proj):
        l, i = self.makeYamlProject(proj, self.projs[proj]["italic"])
        yaml = "\n".join(l)
        info = "\n".join(i)
        yamlfn = f"{proj}.glyphsproject.yaml"
        yamlf = file(yamlfn, "w")
        yamlf.write(yaml)
        yamlf.close()
        infofn = f"{proj}.instancemap.txt"
        infof = file(infofn, "w")
        infof.write(info)
        infof.close()
        print(f"# Saved: {yamlfn} and {infofn}")

    def makeProjects(self):
        for proj in self.projs:
            self.makeProject(proj)


gen = GlyphsProjectGenerator()
gen.makeProjects()
