# Dependency License Explorer
Given dependency information, this Open Source software generates a tree-based view of the dependicies of a project. 
Per dependency it requires: license information, name, and GAV. It also requires a tree-structure of the dependencies. *(Refer to the example projects for more details.)* These were generated in Maven; you do not have to create these yourself. **Support for other project types is planned.** (It is fairly easy to match this style, but we wish to automate it.)

Generated display is HTML/CSS only; any system with an internet browser will support this - we recommend **Google Chrome**. To edit/view more detailed dependency information, as well as generating displays in the first place, requires only vanilla JavaScript. 

**No 3rd party assets** have been, or will be, used.

- [x] HTML/CSS only tree-structure view
- [ ] Display/edit dependency details
- [ ] Export JSON
- [ ] Generate `HTML` from `JSON`
- [x] Warning (missing license) and error (blacklisted license) paths
- [ ] Allow overwriting of module licenses
- [ ] Allow aliases/synonyms of licenses
- [ ] Whitelist/blacklist license customisation
- [ ] Project overview/summary
