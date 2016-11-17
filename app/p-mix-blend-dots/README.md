# Dots' Symmetric Difference(AΔB)

inspired from Bees & Bombs Twitter: <https://twitter.com/beesandbombs/status/796431885836681220>

### Used:

* `mix-blend-mode: difference` for main effect of crossing
* `display: grid` for main layout
* `@supports` for detecting feature support and fallback
* random `transform` for transition animation

Issues:

* Chrome can't set `will-change` on element with `mix-blend-mode`
* Chrome blink at first when transform transition start
