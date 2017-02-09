#!/usr/bin/env python


class GlyphsProjectGenerator(object): 
    def __init__(self): 

        self.fam = "Monoto"
        self.folder = "otf"

        self.projs = { 
            "Monoto-VF": { 
                "italic":  "" 
            }, 
        } 

        self.custs = {
            0: "", 
        }

        self.wghts = {
            100: ["100 Th", "Thin"], 
            188: ["200 ExLt", "ExtraLight"], 
            272: ["300 Lt", "Light"], 
            400: ["400 Rg", ""], 
            562: ["500 Md", "Medium"], 
            738: ["600 SmBd", "SemiBold"], 
            900: ["700 Bd", "Bold"], 
        }

        self.wdths = { 
            30: ["30 UlCd", "Ultra Condensed"], 
            36: ["36 ExCd", "Extra Condensed"], 
            44: ["44 Cd", "Condensed"], 
            53: ["53 SmCd", "SemiCondensed"], 
            62: ["62 No", ""], 
            72: ["72 SmWd", "Semi Expanded"], 
        }

    def makeGInstance(self, cust, wdth, wght, italic): 
        l = []
        l.append('{{   customParameters = ('.format())
        l.append('    {{   name = preferredFamilyName;'.format())
        l.append('        value = "{0} {1}{2}"; }},'.format(self.fam, self.custs[cust], self.wdths[wdth][0]))
        l.append('    {{   name = preferredSubfamilyName;'.format())
        l.append('        value = "{0}{1}"; }}'.format(self.wghts[wght][0], italic))
        l.append('    );'.format())
        l.append('    interpolationCustom = {:d};'.format(cust))
        l.append('    interpolationWeight = {:d};'.format(wght))
        l.append('    interpolationWidth = {:d};'.format(wdth))
        #if len(italic): 
        #    l.append("    isItalic: true".format())
        #else: 
        #    l.append("    isItalic: false".format())
        l.append('    name = "{0}{1} {2}{3}";'.format(self.custs[cust], self.wdths[wdth][0], self.wghts[wght][0], italic))
        if len(self.wghts[wght][1]): 
            l.append('    weightClass = {0};'.format(self.wghts[wght][1]))
        if len(self.wdths[wdth][1]): 
            l.append('    widthClass = "{0}";'.format(self.wdths[wdth][1]))
        l.append("    }},".format())
        return l

    def makeGProlog(self, proj, fmt): 
        l = []
        l.append("(".format(fmt))
        return l

    def makeGEpilog(self, proj, fmt): 
        l = []
        l.append(")".format(fmt))
        return l

    def makeYamlInstance(self, cust, wdth, wght, italic): 
        l = []
        l.append("-   customParameters:".format())
        l.append("    -   name: preferredFamilyName".format())
        l.append("        value: {0} {1}{2}".format(self.fam, self.custs[cust], self.wdths[wdth][0]))
        l.append("    -   name: preferredSubfamilyName".format())
        l.append("        value: {0}{1}".format(self.wghts[wght][0], italic))
        l.append("    interpolationCustom: {:.1f}".format(cust))
        l.append("    interpolationWeight: {:.1f}".format(wght))
        l.append("    interpolationWidth: {:.1f}".format(wdth))
        if len(italic): 
            l.append("    isItalic: true".format())
        else: 
            l.append("    isItalic: false".format())
        l.append("    name: {0}{1} {2}{3}".format(self.custs[cust], self.wdths[wdth][0], self.wghts[wght][0], italic))
        if len(self.wghts[wght][1]): 
            l.append("    weightClass: {0}".format(self.wghts[wght][1]))
        if len(self.wdths[wdth][1]): 
            l.append("    widthClass: {0}".format(self.wdths[wdth][1]))
        return l

    def makeYamlProlog(self, proj, fmt): 
        l = []
        l.append("exportPath: {0}".format(fmt))
        l.append("fontPath: {0}.glyphs".format(proj, fmt))
        l.append("instances:".format())
        return l

    def makeYamlProject(self, proj, italic): 
        l = []
        i = []
        l += (self.makeYamlProlog(proj, self.folder))
        i += (self.makeGProlog(proj, self.folder))
        for cust in sorted(self.custs.keys()): 
            for wdth in sorted(self.wdths.keys()): 
                for wght in sorted(self.wghts.keys()): 
                    l += (self.makeYamlInstance(cust, wdth, wght, italic))
                    i += (self.makeGInstance(cust, wdth, wght, italic))
        i += (self.makeGEpilog(proj, self.folder))
        return l, i

    def makeProject(self, proj): 
        l, i = self.makeYamlProject(proj, self.projs[proj]["italic"])
        yaml = "\n".join(l)
        info = "\n".join(i)
        yamlfn = "{0}.glyphsproject.yaml".format(proj)
        yamlf = file(yamlfn, "w")
        yamlf.write(yaml)
        yamlf.close()
        infofn = "{0}.instancemap.txt".format(proj)
        infof = file(infofn, "w")
        infof.write(info)
        infof.close()
        print("# Saved: {} and {}".format(yamlfn, infofn))


    def makeProjects(self): 
        for proj in self.projs: 
            yaml = l = self.makeProject(proj)

gen = GlyphsProjectGenerator()
gen.makeProjects()

