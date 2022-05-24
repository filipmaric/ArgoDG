const drag = "data:image/png;base64,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";

const line = "data:image/png;base64,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";

const circle = "data:image/png;base64,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";

const midpoint = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABfGlDQ1BpY2MAACiRfZE9SMNAHMVfU4siFQWLFHHIUJ0sSBVx1CoUoUKoFVp1MLl+QpOGJMXFUXAtOPixWHVwcdbVwVUQBD9AHJ2cFF2kxP8lhRYxHhz34929x907QGhUmGp2TQCqZhmpRFzMZFfF7lcEEMYAYhiSmanPSVISnuPrHj6+3kV5lve5P0dfLm8ywCcSzzLdsIg3iKc3LZ3zPnGIleQc8TnxuEEXJH7kuuLyG+eiwwLPDBnp1DxxiFgsdrDSwaxkqMRTxJGcqlG+kHE5x3mLs1qpsdY9+QuDeW1lmes0R5DAIpYgQYSCGsqowEKUVo0UEynaj3v4hx2/RC6FXGUwciygChWy4wf/g9/dmoXJmJsUjAOBF9v+GAW6d4Fm3ba/j227eQL4n4Erre2vNoCZT9LrbS1yBPRvAxfXbU3ZAy53gPCTLhuyI/lpCoUC8H5G35QFBm+B3jW3t9Y+Th+ANHWVvAEODoGxImWve7y7p7O3f8+0+vsBk6pytKr5MIYAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAPxQTFRF////2NjXlJCd29zbUTaEQgDAk4+dQwDAXQD/QgC+2NnYQwDB/f397u7u6Ojo+fn529vak4+c/v7+qampOTk5KSkpdXV109PTICAgAAAAAwMDkJCQrq6uW1tb0NDQGxsbAQEBioqK/Pz8oaGhMTExISEhbW1t6urq8vPxtbO4mpWlxcXG+vr55+fn3t7e+Pj4+vv6h3+ZOwicQgDCPhaMr6y2/v7/1tfURR+PWAD8XAD/UQDsW0aF8fPv/v3/09TRQhqQWgD9UwDvVkCD8PHu/f3/9vf1dmqOPgOwRwDTPg2bnJim///+7e3soJyogXiTs7K4+Pj3+vn/+ff/Sj6iCwAAAAFiS0dEGexutYgAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfmBRgVCQnjd8BJAAAAyklEQVQYGe3BWVsBYRgG4McYDMZaqU+2ivbQ9pRdoaJR4f//F9NJnc28c+a6zH3D59t2AU0LwIOgHgrpQciFI4YRCUNOixpGVINcTI/H9RicmIlkCv/SmUwaTrI7u3u5BOT2D5TKH0KukFdKFU2IlcpKVY4gd3xSrZ2ewcn5xeXVNf6YN/UGnDRv7+4fHvGLJNw9PbfanW4PNvYJd4PhS/t1NIaNE8Ld2/vHdPZpwcY+ITD/+v5ZgBMChIhlWQCXhCdcEZ6QhM+3qdbucxRge/nozQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMDUtMjRUMTk6MDk6MDkrMDI6MDDFVbOEAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTA1LTI0VDE5OjA5OjA5KzAyOjAwtAgLOAAAABt0RVh0aWNjOmNvcHlyaWdodABQdWJsaWMgRG9tYWlutpExWwAAACJ0RVh0aWNjOmRlc2NyaXB0aW9uAEdJTVAgYnVpbHQtaW4gc1JHQkxnQRMAAAAVdEVYdGljYzptYW51ZmFjdHVyZXIAR0lNUEyekMoAAAAOdEVYdGljYzptb2RlbABzUkdCW2BJQwAAAABJRU5ErkJggg==";

const bisector = "data:image/png;base64,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"

const perp = "data:image/png;base64,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";

const parallel = "data:image/png;base64,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";

const intersectLL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAAAAAByaaZbAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5gUYFRAvqnrsrAAAAAJiS0dEAACqjSMyAAABx0lEQVRIx5XVWS9DURAA4JP02bOEN7/C//ATvPIHPNHovbSlC60lEXurKCK2ECRSxFL7EktK0bRUVanqXXLGC1Xae+6Z+3Ym8yX3zEzOEGB82aZIQYywQNgi4cCSB3DAvYcDr0ISBw7bKQ745gEFZGsIByLNWRxYHQQc6N4qEkxrg3cxXhBLzpq0wanjf1ET042esDbwz/w9P08YPVGqfQel9TLvRJ/GGkZilHXpqPjxmx7zNYw+UnaVAr259KjX6I/rlrVn/Ts94mmcSuj3IS3GAADow5Bp5oWncRc2FYDeDwhzrzydpqmhSaDhfmEhxTUa6khlac1Zn7j4xjlLwXJCDFXL79zD5zUQQqpV4ATqZV0JIQYn8AH1rF1c6yirqI1zAeXE2RTIwHV9SAIOIB85zBufADA/pjnEeUA+sFu3swAAtO1YH8h7dlvw+z8SQkoPSEGbY1/+Ce52AhtIO63OQ+U3OLzMBNmtlrbjvHSQzHcMkNm0uk6VP7Fbi8QAgvv8/wwsehkPLgkphWthH4CnD7m1YEriwIGL4oBvAVBAttzgwEPRtcAAK4OAA13bOPAmPuNA4VrQAeOzgAJKyxUOPAlpNvgCGUCt2ns2PH8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTA1LTI0VDE5OjE2OjQ3KzAyOjAwIaVCbgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0wNS0yNFQxOToxNjo0NyswMjowMFD4+tIAAAAbdEVYdGljYzpjb3B5cmlnaHQAUHVibGljIERvbWFpbraRMVsAAAAidEVYdGljYzpkZXNjcmlwdGlvbgBHSU1QIGJ1aWx0LWluIHNSR0JMZ0ETAAAAFXRFWHRpY2M6bWFudWZhY3R1cmVyAEdJTVBMnpDKAAAADnRFWHRpY2M6bW9kZWwAc1JHQltgSUMAAAAASUVORK5CYII=";

const intersectLC_both = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABfGlDQ1BpY2MAACiRfZE9SMNAHMVfU4siFQWLFHHIUJ0sSBVx1CoUoUKoFVp1MLl+QpOGJMXFUXAtOPixWHVwcdbVwVUQBD9AHJ2cFF2kxP8lhRYxHhz34929x907QGhUmGp2TQCqZhmpRFzMZFfF7lcEEMYAYhiSmanPSVISnuPrHj6+3kV5lve5P0dfLm8ywCcSzzLdsIg3iKc3LZ3zPnGIleQc8TnxuEEXJH7kuuLyG+eiwwLPDBnp1DxxiFgsdrDSwaxkqMRTxJGcqlG+kHE5x3mLs1qpsdY9+QuDeW1lmes0R5DAIpYgQYSCGsqowEKUVo0UEynaj3v4hx2/RC6FXGUwciygChWy4wf/g9/dmoXJmJsUjAOBF9v+GAW6d4Fm3ba/j227eQL4n4Erre2vNoCZT9LrbS1yBPRvAxfXbU3ZAy53gPCTLhuyI/lpCoUC8H5G35QFBm+B3jW3t9Y+Th+ANHWVvAEODoGxImWve7y7p7O3f8+0+vsBk6pytKr5MIYAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAhZQTFRF/////f39/v7+9fX12NjYsrKyoqKimpqak5OTlpaWnp6ep6enxsbG6urq/Pz86enppKSkgYGBioqKrq6uxMTEzc3N09PTyMjIvLy8nZ2dhYWFjo6O+vr69vb2t7e3hISEra2t5eXl+/v78/Pzzs7OlJSU3d3d7+/vmZmZoKCg6Ojox8fHurq6tbW1sLCw9PT08vLy4uLi4+PjkZGRwMDAU1NTCgoKAAAA6+vr3NzcnJycjIyMiIiI5ubmg4OD5+fnNTU1GBgYfHx8iYmJj4+PzMzM8PDwh4eHv7+/8fHx39/ftLS0fn5+HBwcHR0d+Pj4xcXFqKior6+v9/f32trawsLCi4uLsbGx29vb7e3td3d3BgYGZWVl+fn5ExMTAgICEBAQ0NDQvb29paWlqampgoKCJSUlLy8vmJiYwcHB19fXrKysdnZ2Dg4OLi4ukpKSpqamubm50dHRXl5eBQUFf39/2dnZ5OTkWVlZ5ebjy8zK+Pj30dDRVz2GQAqlPxWQjYWc+vv5/fz//v3//v7//Pz6c2qJRwDTXAD/WAD9QhmUy8vK/f3/1NTUl5eX+Pn2ZFSFUADoWwD/QAujubq6m5ejPgikUADrVz6G5ufk9vb1oJuoYlKEc2mJ0NDR+/r/w8PDhoaG7u7u/f799/j2+/v6oaGhgICAy8vLtra2kJCQysrKycnJ3t7e7Ozsn5+f4eHh/v//fNLwIgAAAAFiS0dENzC4uEcAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfmBRgVGzm9WoA2AAACV0lEQVRIx2NgGAUUAEYmopUyMbOwsrFzcHJx8/DyEaGeX0BQSFhElEVMXEJSSlpchoByWTl5BUUlmF3KKtKqanjdpq6hqYUiIKMtr6MrpKcPMUDJwBBVvZGxCSO6GYqmZuZmUrIWliJ6VtY21ihytnYqmKFl72Bubu7o5OzCputqqK6ELOfm7oEcWEqeXqLemsY+vkANfq7+6Fb7BwTKB0H8xxTMGxIqzB5mI80ezhMRGRVtbh4Ti2EzR1x8gjCTsm1iUjKHkI2xgJyKkRskFtxSfFJdlNA1qKUBLU4Xcg/LCMzM0gpGs1/GRRzhVFl+Fo9sjZxcoIa8RDd/7KGuYg03wljIOb+gsEitON68pBRnHBkIwqOnjB/i/3LTigw33DHKLoIuwuuuj8yt1KmqRuZLcKNrMApDDoia2rr6hkaGpmYGhpYWkIA4F7qGMg4kD7S2tXd0dnWDNfQ0g0TEONE19PYhcfonTJzUMXkKmA2xgUUVPUC8pJEzy9Rp09tnzIQqBgFRdnQbbJ2Rs8qs2XPmzmNgmN8EE1jAhq7Bc+EiZO7iJUsZkDUosGKENKcoZujDncTnzIIhKbEMT04sF2TGELNdboFbQ7YANsEUnOrt5fmxFQALLXEValxyWMVXSOFw1MpVstgldKWxSqy2w+U7RgUNdcySc42zIe4S2MR4LVqaCfbm5MdXEKu4p6xD4iupWLN5IsVjC6YWt+zS9SsWyfAxMSkFb1gpFCaGlCZbmluwWWKrky/lLN3HEeYexp0YjJpSNuJwmKetV2+ZEW/saL06aAEA5SpymkPuM5EAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTA1LTI0VDE5OjI3OjU3KzAyOjAwmy9PzwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0wNS0yNFQxOToyNzo1NyswMjowMOpy93MAAAAbdEVYdGljYzpjb3B5cmlnaHQAUHVibGljIERvbWFpbraRMVsAAAAidEVYdGljYzpkZXNjcmlwdGlvbgBHSU1QIGJ1aWx0LWluIHNSR0JMZ0ETAAAAFXRFWHRpY2M6bWFudWZhY3R1cmVyAEdJTVBMnpDKAAAADnRFWHRpY2M6bW9kZWwAc1JHQltgSUMAAAAASUVORK5CYII=";

const intersectLC_other = "data:image/png;base64,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";

const intersectCC_both = "data:image/png;base64,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";

const intersectCC_other = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABfGlDQ1BpY2MAACiRfZE9SMNAHMVfU4siFQWLFHHIUJ0sSBVx1CoUoUKoFVp1MLl+QpOGJMXFUXAtOPixWHVwcdbVwVUQBD9AHJ2cFF2kxP8lhRYxHhz34929x907QGhUmGp2TQCqZhmpRFzMZFfF7lcEEMYAYhiSmanPSVISnuPrHj6+3kV5lve5P0dfLm8ywCcSzzLdsIg3iKc3LZ3zPnGIleQc8TnxuEEXJH7kuuLyG+eiwwLPDBnp1DxxiFgsdrDSwaxkqMRTxJGcqlG+kHE5x3mLs1qpsdY9+QuDeW1lmes0R5DAIpYgQYSCGsqowEKUVo0UEynaj3v4hx2/RC6FXGUwciygChWy4wf/g9/dmoXJmJsUjAOBF9v+GAW6d4Fm3ba/j227eQL4n4Erre2vNoCZT9LrbS1yBPRvAxfXbU3ZAy53gPCTLhuyI/lpCoUC8H5G35QFBm+B3jW3t9Y+Th+ANHWVvAEODoGxImWve7y7p7O3f8+0+vsBk6pytKr5MIYAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAkNQTFRF/////v7+9PT04ODgxsbGs7Ozra2ttbW1ysrK5OTk9vb28vLyx8fHsLCwxcXF29vb4+Pj2NjYwcHBr6+vzs7O2trasrKy0tLS9fX18fHxzMzM/Pz8ubm58PDw6enp7+/v4uLi4eHh+Pj4/v//1dbW8/Pzv7+/3t7e2dnZtra2t7e30NDQwsLCycfH9sbG/+bm8snJ24eH+fT0u7u75ubm3d3d6urq+/v74Nvb821t/1dX6ra20p2d9kdH/pGR//z85+fnsbGx9/f309PT6Ojo/v7//vDw7np65g4O5AEBviQk4dnZ/f39zc3NyMjI//7/2aSk5AUF8QAAtAkJzbS07OzsrKys+fn5+vr6/97e/lhYsxsbYgwM1BYW+llZ/+Tk7e3t/6en/5WVubCwp6mpyLGx0mVl/83N+Pn2+fr30dHR19fX//7+//j4//v7ycnJ9/j4urm58O7uysXVelu3gGW22dbfvb29vr6+1tfX8vPwakmtUgDzTwDqf2up+vz45eXlw8PD1tbWqqqqakmrUgDxTwDogGuo+/z4/v795eTm19Xb9vf26+vrurq67u7u///+z8rZeFm0gWa33NriwMDA08/baDq+VhnHm4bD+fr439/f/v/++/v5mIW9UgDtWQD/XijD4uLj5OPktqzJVBPOUgDld1W58PHw9fX2vLXLp5q/4N/j/f3/xMTE1dXVoaGhjIyMfX19XV1dAAAABwcHkJCQvLy8Nzc3ZWVlioqKExMTJSUliYmJ3NzctLS0z8/Pdk3CsgAAAAFiS0dEtEQJat0AAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfmBRgXBA1SMK5zAAACe0lEQVRIx2NgGAXDFDAykqCWiZmFlY2NnYOTixhdjNw8vHz8zJwCzIJCwiJchNWLiolLQA1mlJRiFSCgXlpERhaZL8cqiO4saXlOBUUBOSWwuLIKnxKqtKqaOgpfSUNTi09Km0eHVVdPn4HBwNAI3U4mYxMkB5vySpmZQ0LGwtLK2sbWzh7DlQ6OTnDXOMu4AF3i6grmubl7eHp5Y/EXizOU4ePrB9Tr7w/VwBAQGBQcgkVDaFg4hCEuEwEyHqqcITIqOiY2Lh5Tg4+jA5hOcAQFoKsrTEtiUnJKalo61HcZmYjgzBIEUzzZEC5UQ05uXn5oQWERRLC4pLQMroFZG0TKlkdA+TA3+VRIMlT6gZlV1TW1dfWw8GhoBJFNLBhuBWoIbQYbU9XS2tbeAbMcokGNGaaws6u7B8zw62Xw6esHsSZMnDR5CgPMexAnTZWDaZg2fcbMWSCX+c5mYNDpBYvNmTV3AiyCGLRBvvXhgSWyCfPmL1i4CCS7GOhKKReEG6EapHlBwcrYGAoTX7J02fIVIK+v1JJg4DHDiIdeSMSVN8AEnFatXsOwFmRavjaDWiiGhnXrwZRUFlxkwgQGiAbJDRs3mWEmPkiKdyhHyRlg9zpt3rJ1G5p61e1QX0kLOWAmsx1btuw0R1VvDM9As2WkMaJu1+49e5GzKKMDOz/cIT5qUugaJDX59qlrcTBB1fjIrpNpQJLm6jNFVS8xFWS9qt9+mSx1F4d9IprsB5xQDZyqjexgF81ssNGMXKY6On48U/kUlNCd4MSnJeADda2E335FwkUlI7NQeb5Gg5y6eKOalARRBal0qFQ5H4uQELMTI21K6lEwoAAAvu2AEin5SFEAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTA1LTI0VDIxOjA0OjEzKzAyOjAwfhORUgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0wNS0yNFQyMTowNDoxMyswMjowMA9OKe4AAAAbdEVYdGljYzpjb3B5cmlnaHQAUHVibGljIERvbWFpbraRMVsAAAAidEVYdGljYzpkZXNjcmlwdGlvbgBHSU1QIGJ1aWx0LWluIHNSR0JMZ0ETAAAAFXRFWHRpY2M6bWFudWZhY3R1cmVyAEdJTVBMnpDKAAAADnRFWHRpY2M6bW9kZWwAc1JHQltgSUMAAAAASUVORK5CYII=";

export {drag, line, circle, midpoint, bisector, perp, parallel, intersectLL, intersectLC_both, intersectLC_other, intersectCC_both, intersectCC_other};