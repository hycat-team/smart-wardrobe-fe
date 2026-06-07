giao diện người dùng khi đăng nhập 
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Wardrobe Dashboard - Ethos Atelier</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "primary-fixed-dim": "#c8c6c6",
                    "on-error": "#ffffff",
                    "secondary-fixed-dim": "#c8c8b0",
                    "on-primary": "#ffffff",
                    "inverse-surface": "#2f3130",
                    "primary-container": "#2d2d2d",
                    "on-primary-container": "#959494",
                    "primary": "#181919",
                    "on-tertiary": "#ffffff",
                    "on-secondary": "#ffffff",
                    "on-surface-variant": "#444748",
                    "on-secondary-fixed-variant": "#474836",
                    "on-secondary-container": "#636451",
                    "on-secondary-fixed": "#1b1d0e",
                    "surface-container-low": "#f4f4f2",
                    "surface-container-lowest": "#ffffff",
                    "error-container": "#ffdad6",
                    "error": "#ba1a1a",
                    "on-surface": "#1a1c1b",
                    "secondary": "#5e604d",
                    "on-background": "#1a1c1b",
                    "surface-container": "#eeeeec",
                    "outline": "#747878",
                    "surface-dim": "#dadad8",
                    "secondary-fixed": "#e4e4cc",
                    "primary-fixed": "#e4e2e1",
                    "secondary-container": "#e1e1c9",
                    "on-tertiary-container": "#849990",
                    "on-tertiary-fixed-variant": "#374b43",
                    "tertiary-container": "#1d312a",
                    "inverse-primary": "#c8c6c6",
                    "background": "#f9f9f7",
                    "surface": "#f9f9f7",
                    "inverse-on-surface": "#f1f1ef",
                    "surface-bright": "#f9f9f7",
                    "surface-container-high": "#e8e8e6",
                    "on-tertiary-fixed": "#0b1f18",
                    "tertiary": "#081c15",
                    "on-primary-fixed": "#1b1c1c",
                    "outline-variant": "#c4c7c7",
                    "tertiary-fixed": "#d1e8dd",
                    "tertiary-fixed-dim": "#b5ccc1",
                    "surface-tint": "#5f5e5e",
                    "surface-variant": "#e2e3e1",
                    "surface-container-highest": "#e2e3e1",
                    "on-error-container": "#93000a",
                    "on-primary-fixed-variant": "#474747"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "margin-mobile": "20px",
                    "gutter": "24px",
                    "unit": "8px",
                    "margin-desktop": "64px",
                    "container-max": "1280px",
                    "section-gap": "80px"
            },
            "fontFamily": {
                    "label-caps": [
                            "Inter"
                    ],
                    "body-lg": [
                            "Inter"
                    ],
                    "title-lg": [
                            "Inter"
                    ],
                    "headline-md-mobile": [
                            "Playfair Display"
                    ],
                    "display-lg-mobile": [
                            "Playfair Display"
                    ],
                    "body-sm": [
                            "Inter"
                    ],
                    "display-lg": [
                            "Playfair Display"
                    ],
                    "headline-md": [
                            "Playfair Display"
                    ]
            },
            "fontSize": {
                    "label-caps": [
                            "12px",
                            {
                                    "lineHeight": "1",
                                    "letterSpacing": "0.1em",
                                    "fontWeight": "700"
                            }
                    ],
                    "body-lg": [
                            "16px",
                            {
                                    "lineHeight": "1.6",
                                    "fontWeight": "400"
                            }
                    ],
                    "title-lg": [
                            "20px",
                            {
                                    "lineHeight": "1.4",
                                    "letterSpacing": "-0.01em",
                                    "fontWeight": "600"
                            }
                    ],
                    "headline-md-mobile": [
                            "24px",
                            {
                                    "lineHeight": "1.2",
                                    "fontWeight": "500"
                            }
                    ],
                    "display-lg-mobile": [
                            "36px",
                            {
                                    "lineHeight": "1.1",
                                    "fontWeight": "600"
                            }
                    ],
                    "body-sm": [
                            "14px",
                            {
                                    "lineHeight": "1.5",
                                    "fontWeight": "400"
                            }
                    ],
                    "display-lg": [
                            "48px",
                            {
                                    "lineHeight": "1.1",
                                    "letterSpacing": "-0.02em",
                                    "fontWeight": "600"
                            }
                    ],
                    "headline-md": [
                            "32px",
                            {
                                    "lineHeight": "1.2",
                                    "fontWeight": "500"
                            }
                    ]
            }
        },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
          font-variation-settings:
          'FILL' 0,
          'wght' 400,
          'GRAD' 0,
          'opsz' 24
        }
        .material-symbols-outlined[data-weight="fill"] {
            font-variation-settings: 'FILL' 1;
        }
        
        /* Ambient shadows for cards */
        .card-shadow {
            box-shadow: 0px 10px 30px rgba(45, 45, 45, 0.05);
        }
        .card-shadow-hover:hover {
            box-shadow: 0px 15px 40px rgba(45, 45, 45, 0.08);
            transform: translateY(-2px);
        }
        
        /* Soft Beige background utility */
        .bg-soft-beige {
            background-color: #f4f4f2; /* surface-container-low */
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-lg text-body-lg antialiased selection:bg-primary selection:text-on-primary flex h-screen overflow-hidden">
<!-- Desktop SideNav -->
<aside class="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest dark:bg-primary-container shadow-sm z-40">
<div class="flex flex-col h-full p-gutter">
<!-- Header -->
<div class="mb-12">
<div class="flex items-center gap-4 mb-8">
<img alt="User profile" class="w-12 h-12 rounded-full object-cover" data-alt="A sophisticated close-up portrait of a woman looking directly at the camera, styled with minimal makeup and natural lighting. The mood is calm and elegant, fitting for a premium fashion application. The background is a soft, out-of-focus studio grey, ensuring the subject remains the focal point while maintaining a light, modern aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJU36G0jAyT3_teG1L0lE6Qak1thzSi7kjNtr_9mjP6LX8JHx1OLMB13Xec8q7u-wrXoV7_En96alFmahRajtLxfNAQAPu6FupKReczRaISej-vseVpME1f8lAdp2wCIMRFDO57B8BFxla8pMpF09m7efC7eVoAsUkE51_wlHDZeIyYc1jAb7V0OqJPx2ajZzC6E5dZ0S44wu_gEAieK_nRvbOC5dYQKVMfYm_fhrCWSt-HrF_eovqXfW9mf1r24Zn9rKy-CEUllY"/>
<div>
<h2 class="font-display-lg text-title-lg text-primary dark:text-primary-fixed tracking-tight">Ethos Atelier</h2>
<p class="font-body-sm text-body-sm text-on-surface-variant">Curated Wardrobe</p>
</div>
</div>
<!-- CTA -->
<button class="w-full bg-primary text-on-primary font-body-lg text-body-lg font-medium h-12 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
<span class="material-symbols-outlined text-[20px]">add</span>
                    Upload Item
                </button>
</div>
<!-- Main Navigation -->
<nav class="flex-1 space-y-2">
<a class="flex items-center gap-4 px-4 py-3 text-primary dark:text-primary-fixed font-bold bg-secondary-container/50 dark:bg-secondary/20 rounded-lg Active: scale-95 transition-transform" href="#">
<span class="material-symbols-outlined" data-icon="checkroom">checkroom</span>
<span class="font-body-lg text-body-lg">Wardrobe</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 text-on-surface-variant dark:text-on-primary-container hover:bg-secondary-container/30 dark:hover:bg-secondary/10 transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="auto_fix_high">auto_fix_high</span>
<span class="font-body-lg text-body-lg">AI Stylist</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 text-on-surface-variant dark:text-on-primary-container hover:bg-secondary-container/30 dark:hover:bg-secondary/10 transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="grid_view">grid_view</span>
<span class="font-body-lg text-body-lg">Social Feed</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 text-on-surface-variant dark:text-on-primary-container hover:bg-secondary-container/30 dark:hover:bg-secondary/10 transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="storefront">storefront</span>
<span class="font-body-lg text-body-lg">Marketplace</span>
</a>
</nav>
<!-- Footer Navigation -->
<div class="pt-8 border-t border-outline-variant/30 space-y-2">
<a class="flex items-center gap-4 px-4 py-3 text-on-surface-variant dark:text-on-primary-container hover:bg-secondary-container/30 dark:hover:bg-secondary/10 transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-body-lg text-body-lg">Settings</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 text-on-surface-variant dark:text-on-primary-container hover:bg-secondary-container/30 dark:hover:bg-secondary/10 transition-colors rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="help_outline">help_outline</span>
<span class="font-body-lg text-body-lg">Support</span>
</a>
</div>
</div>
</aside>
<!-- Mobile Top AppBar -->
<header class="md:hidden fixed top-0 w-full z-40 bg-background dark:bg-primary flex justify-between items-center px-margin-mobile py-4 shadow-sm">
<h1 class="font-display-lg-mobile text-headline-md-mobile text-primary dark:text-primary-fixed tracking-tight">Ethos Atelier</h1>
<div class="flex items-center gap-4">
<button class="text-primary dark:text-primary-fixed hover:opacity-80 transition-opacity">
<span class="material-symbols-outlined" data-icon="search">search</span>
</button>
<img alt="User profile portrait" class="w-8 h-8 rounded-full object-cover" data-alt="A close-up headshot of a person with natural lighting, styled simply, set against a neutral, blurred background suitable for a small avatar image in a minimalist fashion UI." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPJ7ntWw8T9xRpvZHiqq1cWkeZrnw4-9X1wCKA_VJReNkBY4w0HvkpYdtrLwCviwan0ORBCY5tZ3vvZgHnOFxgxSSz1rvyYLqLn9vz21F4wuqV7rZQ7ufbLQJD-LcjZzE5h3hL7pnav-1NP_Nr7oBtWljH1XqTf0fAxwmT8xi126-9X1llghUytZzkGiE5d4LDAyDYszYRAXMt9PjTMFihkR5NXtbgeby4HtAUUrsTLUhE-jj8wTuY6Lmlm_8USG0GuYcqRhWLz_s"/>
</div>
</header>
<!-- Main Content Area -->
<main class="flex-1 ml-0 md:ml-64 mt-[72px] md:mt-0 h-full overflow-y-auto bg-background px-margin-mobile md:px-margin-desktop py-8 md:py-12 pb-32 md:pb-12">
<div class="max-w-container-max mx-auto">
<!-- Page Header & Actions -->
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
<div>
<h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight mb-2">My Wardrobe</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant">142 items curated for you.</p>
</div>
<div class="flex flex-wrap items-center gap-4">
<!-- Search Input -->
<div class="relative w-full md:w-64">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input class="w-full bg-surface-container-low border-b border-primary/20 focus:border-primary focus:bg-surface-container-lowest pl-10 pr-4 py-3 rounded-t-lg outline-none transition-colors font-body-sm text-body-sm text-primary placeholder:text-on-surface-variant/60" placeholder="Search items..." type="text"/>
</div>
<!-- Filters -->
<button class="flex items-center gap-2 px-4 py-3 rounded-lg border border-outline-variant text-primary font-body-sm text-body-sm hover:bg-surface-container-low transition-colors">
<span class="material-symbols-outlined text-[18px]">tune</span>
                        Filters
                    </button>
</div>
</div>
<!-- Categories / Tabs -->
<div class="flex overflow-x-auto hide-scrollbar gap-8 mb-8 pb-2 border-b border-outline-variant/20">
<button class="font-body-lg text-body-lg font-medium text-primary border-b-2 border-primary pb-2 whitespace-nowrap">All Items</button>
<button class="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors pb-2 whitespace-nowrap">Tops</button>
<button class="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors pb-2 whitespace-nowrap">Bottoms</button>
<button class="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors pb-2 whitespace-nowrap">Dresses</button>
<button class="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors pb-2 whitespace-nowrap">Outerwear</button>
<button class="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors pb-2 whitespace-nowrap">Shoes &amp; Accessories</button>
</div>
<!-- Wardrobe Grid (Bento style inspiration) -->
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-gutter">
<!-- Item Card 1 -->
<div class="group bg-surface-container-lowest rounded-xl overflow-hidden card-shadow card-shadow-hover transition-all duration-300 border border-outline-variant/10 cursor-pointer">
<div class="relative aspect-[3/4] bg-surface-container-low overflow-hidden">
<img alt="White silk blouse" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" data-alt="A pristine white silk blouse elegantly draped over a minimalist wooden hanger. The garment is photographed against a stark white background in a studio setting with soft, diffused lighting that highlights the luxurious texture and drape of the fabric. The overall mood is sophisticated, clean, and representative of high-end fashion catalog photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc0UY91dBEvfD6aO4WTT7IDAl9GH7kRQyIaMCO9Rm8ajIMBB-4nNMkbdvGfGYJ4JLg61QmyWRrNP4ekgKTp4kIEJ2HxrmDtxdMg9lBJTkzpXmODB4tCT7jPT6Br8cN6CaXahyG8GYZ8bgFlj0f960wiIAzcgfBvh2Zqx28mIb8n7kjd6WUfoxb5Rhs8iQAzHiuugt90KUsi93ZB_VYqOgu33WhEeTlpDMfDx5vgnjt7UIWZ7hdT1VBxcRL0VhH1hhYPjITq8m9Uj8"/>
<div class="absolute top-3 left-3 flex gap-2">
<span class="bg-secondary/10 text-secondary font-label-caps text-[10px] px-2 py-1 rounded-sm backdrop-blur-md">ORGANIC SILK</span>
</div>
</div>
<div class="p-4">
<h3 class="font-title-lg text-body-lg text-primary truncate">Minimalist Silk Blouse</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Acne Studios • Size S</p>
</div>
</div>
<!-- Item Card 2 -->
<div class="group bg-surface-container-lowest rounded-xl overflow-hidden card-shadow card-shadow-hover transition-all duration-300 border border-outline-variant/10 cursor-pointer">
<div class="relative aspect-[3/4] bg-surface-container-low overflow-hidden">
<img alt="Beige tailored trousers" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" data-alt="A pair of impeccably tailored beige wool trousers laid flat against a subtle off-white background. The lighting is soft and even, casting minimal shadows to emphasize the clean lines and fine weave of the fabric. The image exudes a calm, structured, and modern editorial aesthetic typical of premium sustainable fashion brands." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgjt6Ew1Q5nSLBCmDoXGWi6QG4pwbBBnuBfQTQGSh4alKXoBPHGd4TU7ZbEJWdRepwDdPBwbWrrYR7N2GDisj4Y22m1F6T_2-BLiPB4i9YxLpA6Hk6EYH-kF5wvJLU-pX72tseu3ZxR9SyqU6UDlIRMEmrOe1SDR5DGpkVL_yHkEGIx8nOIKhKVOtvujux8bb78CQWIeskNuWF1AOaVkq1bI21CpfVExGNL8rHUuiZ8Gh_4boMKKV49qORMKqwcCcITBJEKhdVOfw"/>
<div class="absolute top-3 left-3 flex gap-2">
<span class="bg-secondary/10 text-secondary font-label-caps text-[10px] px-2 py-1 rounded-sm backdrop-blur-md">WOOL BLEND</span>
</div>
</div>
<div class="p-4">
<h3 class="font-title-lg text-body-lg text-primary truncate">Pleated Wool Trousers</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">The Row • Size 36</p>
</div>
</div>
<!-- Item Card 3 (Featured/Wider) -->
<div class="group bg-surface-container-lowest rounded-xl overflow-hidden card-shadow card-shadow-hover transition-all duration-300 border border-outline-variant/10 cursor-pointer col-span-2 md:col-span-1 lg:col-span-2 lg:row-span-2">
<div class="relative h-full min-h-[300px] bg-surface-container-low overflow-hidden">
<img alt="Oversized leather jacket" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" data-alt="A high-quality, distressed black leather oversized biker jacket photographed in a moody, softly lit studio environment. The jacket rests elegantly on an invisible mannequin, showcasing its structural silhouette and silver hardware details. The background is a muted, warm beige that contrasts perfectly with the dark leather, creating a premium, edgy yet refined editorial look." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgFpqic7HpkQgM4OnhULKD_hpW5bD4eQPmMqXLvrZxfiVa_dBpnFmshefaJE8L5ciGxLft4J3Ll92qUEZYaWNwAKcbA5EWGZ42zoMWWglFclbcgC9IWKPBcLznY6o7xWTDaXx7kY0r6wLi2mRcnr1EMIgdBy_bcjfF06DhafcgN-GcNwzASqxt3oZ250Enqw1Nac_VpmQ6e0kNAcg_dLg2ndwdN9pvXndMNDxo7wj7nx56JV2JzkOvtInehDgYIb7zKKilDN-RJGU"/>
<div class="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex flex-col justify-end p-6">
<div class="flex gap-2 mb-3">
<span class="bg-surface-container-lowest/20 text-on-primary font-label-caps text-[10px] px-2 py-1 rounded-sm backdrop-blur-md border border-on-primary/20">VINTAGE</span>
<span class="bg-surface-container-lowest/20 text-on-primary font-label-caps text-[10px] px-2 py-1 rounded-sm backdrop-blur-md border border-on-primary/20">HEAVY WEAR</span>
</div>
<h3 class="font-title-lg text-headline-md text-on-primary">Oversized Moto Jacket</h3>
<p class="font-body-sm text-body-sm text-on-primary/80 mt-1">Vintage Balenciaga • One Size</p>
</div>
</div>
</div>
<!-- Item Card 4 -->
<div class="group bg-surface-container-lowest rounded-xl overflow-hidden card-shadow card-shadow-hover transition-all duration-300 border border-outline-variant/10 cursor-pointer">
<div class="relative aspect-[3/4] bg-surface-container-low overflow-hidden">
<img alt="White sneakers" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" data-alt="A pair of clean, minimalist white leather low-top sneakers presented on a concrete-textured surface. The lighting is crisp and directional, casting subtle shadows that highlight the smooth texture of the leather and the clean stitching. The composition is simple and geometric, conveying a sense of modern, everyday luxury and practical design." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB61fjzz5gYRFSQpJrtsuoPBeMnJipC-jdTEeuyswGolIPrpRNKMvxzimaE-fU6Y3STwrW57w9mbfQNaJn4PcHIH4fgd7cOVrr1Kmvt-oKl_1U3Wu2_d9EhxnCsXNI0bU6v08VIgVxbJ-tr1HLORoSymgQYOKYrg1ugcJb2S-Yx-xSR0KPrqv0DI4kKVGvcZgxw3gySTEBauPoZ-D1WfJzFDTDR3Q0ROAbI9pdull0IF4DZhxHlPTfJTlCarSsBjqiY4h8yzPCuDxI"/>
</div>
<div class="p-4">
<h3 class="font-title-lg text-body-lg text-primary truncate">Essential Leather Trainers</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Common Projects • Size 39</p>
</div>
</div>
<!-- Item Card 5 -->
<div class="group bg-surface-container-lowest rounded-xl overflow-hidden card-shadow card-shadow-hover transition-all duration-300 border border-outline-variant/10 cursor-pointer">
<div class="relative aspect-[3/4] bg-surface-container-low overflow-hidden">
<img alt="Black sunglasses" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" data-alt="A pair of sleek, black geometric sunglasses resting on a glossy, reflective surface. The lighting is dramatic, creating stark highlights on the acetate frames and deep shadows that emphasize their angular shape. The setting is highly minimalist, utilizing a monochromatic color scheme to project an aura of high fashion and chic sophistication." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH1oofVXCEykdI5UzLvQHNSgBYNOn9pBMec1JBb92JXZuGl--msV7sWMhhx44dOiNsNc2RDnnwiy5mb39GXfpKEvYJkaejan_PloeHOWyqxW8eRcjzrmVlieymrPwZJma73IzOFPyb1kKR0Sp-E8a_-qfGEGqTbPg6q1kQh7uv11m9H7Okt1JJGTUXG2X1Fs5Yz-JdsmKj586uOTAtlAZx2h2WrMioaOQhZeb1PRNu2TrqY-ikPseXxSInrqQl_KtdlqSl-dWZwMo"/>
</div>
<div class="p-4">
<h3 class="font-title-lg text-body-lg text-primary truncate">Geometric Sunglasses</h3>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Celine • OS</p>
</div>
</div>
</div>
<!-- Load More -->
<div class="mt-12 flex justify-center">
<button class="px-8 py-3 border border-primary text-primary font-body-lg text-body-lg rounded-full hover:bg-primary hover:text-on-primary transition-colors duration-300">
                    Load More Items
                </button>
</div>
</div>
</main>
<!-- Mobile BottomNavBar -->
<nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container-lowest/80 dark:bg-primary-container/80 backdrop-blur-xl border-t border-outline-variant/30 rounded-t-xl shadow-lg">
<a class="flex flex-col items-center justify-center text-primary dark:text-primary-fixed font-bold active:bg-secondary-container dark:active:bg-secondary/20 Active: scale-90 transition-transform duration-200" href="#">
<span class="material-symbols-outlined mb-1" data-icon="checkroom" data-weight="fill">checkroom</span>
<span class="font-label-caps text-[10px]">Wardrobe</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 dark:text-on-primary-container/60 active:bg-secondary-container dark:active:bg-secondary/20" href="#">
<span class="material-symbols-outlined mb-1" data-icon="auto_fix_high">auto_fix_high</span>
<span class="font-label-caps text-[10px]">Stylist</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 dark:text-on-primary-container/60 active:bg-secondary-container dark:active:bg-secondary/20" href="#">
<span class="material-symbols-outlined mb-1" data-icon="grid_view">grid_view</span>
<span class="font-label-caps text-[10px]">Social</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 dark:text-on-primary-container/60 active:bg-secondary-container dark:active:bg-secondary/20" href="#">
<span class="material-symbols-outlined mb-1" data-icon="sell">sell</span>
<span class="font-label-caps text-[10px]">Market</span>
</a>
</nav>
</body></html>

<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Ethos Atelier - AI Stylist</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Playfair+Display:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "primary-fixed-dim": "#c8c6c6",
                    "on-error": "#ffffff",
                    "secondary-fixed-dim": "#c8c8b0",
                    "on-primary": "#ffffff",
                    "inverse-surface": "#2f3130",
                    "primary-container": "#2d2d2d",
                    "on-primary-container": "#959494",
                    "primary": "#181919",
                    "on-tertiary": "#ffffff",
                    "on-secondary": "#ffffff",
                    "on-surface-variant": "#444748",
                    "on-secondary-fixed-variant": "#474836",
                    "on-secondary-container": "#636451",
                    "on-secondary-fixed": "#1b1d0e",
                    "surface-container-low": "#f4f4f2",
                    "surface-container-lowest": "#ffffff",
                    "error-container": "#ffdad6",
                    "error": "#ba1a1a",
                    "on-surface": "#1a1c1b",
                    "secondary": "#5e604d",
                    "on-background": "#1a1c1b",
                    "surface-container": "#eeeeec",
                    "outline": "#747878",
                    "surface-dim": "#dadad8",
                    "secondary-fixed": "#e4e4cc",
                    "primary-fixed": "#e4e2e1",
                    "secondary-container": "#e1e1c9",
                    "on-tertiary-container": "#849990",
                    "on-tertiary-fixed-variant": "#374b43",
                    "tertiary-container": "#1d312a",
                    "inverse-primary": "#c8c6c6",
                    "background": "#f9f9f7",
                    "surface": "#f9f9f7",
                    "inverse-on-surface": "#f1f1ef",
                    "surface-bright": "#f9f9f7",
                    "surface-container-high": "#e8e8e6",
                    "on-tertiary-fixed": "#0b1f18",
                    "tertiary": "#081c15",
                    "on-primary-fixed": "#1b1c1c",
                    "outline-variant": "#c4c7c7",
                    "tertiary-fixed": "#d1e8dd",
                    "tertiary-fixed-dim": "#b5ccc1",
                    "surface-tint": "#5f5e5e",
                    "surface-variant": "#e2e3e1",
                    "surface-container-highest": "#e2e3e1",
                    "on-error-container": "#93000a",
                    "on-primary-fixed-variant": "#474747"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "margin-mobile": "20px",
                    "gutter": "24px",
                    "unit": "8px",
                    "margin-desktop": "64px",
                    "container-max": "1280px",
                    "section-gap": "80px"
            },
            "fontFamily": {
                    "label-caps": ["Inter"],
                    "body-lg": ["Inter"],
                    "title-lg": ["Inter"],
                    "headline-md-mobile": ["Playfair Display"],
                    "display-lg-mobile": ["Playfair Display"],
                    "body-sm": ["Inter"],
                    "display-lg": ["Playfair Display"],
                    "headline-md": ["Playfair Display"]
            },
            "fontSize": {
                    "label-caps": ["12px", {"lineHeight": "1", "letterSpacing": "0.1em", "fontWeight": "700"}],
                    "body-lg": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                    "title-lg": ["20px", {"lineHeight": "1.4", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "headline-md-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "500"}],
                    "display-lg-mobile": ["36px", {"lineHeight": "1.1", "fontWeight": "600"}],
                    "body-sm": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                    "display-lg": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                    "headline-md": ["32px", {"lineHeight": "1.2", "fontWeight": "500"}]
            }
          }
        }
      }
    </script>
<style>
        body { background-color: theme('colors.background'); color: theme('colors.on-background'); }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; }
        .material-symbols-outlined.filled { font-variation-settings: 'FILL' 1; }
        
        /* Ambient shadow utility */
        .shadow-ambient { box-shadow: 0px 10px 30px rgba(45, 45, 45, 0.05); }
        
        /* Hide scrollbar for clean UI */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="font-body-lg min-h-screen flex antialiased">
<!-- Desktop Side Navigation -->
<nav class="hidden md:flex flex-col bg-surface-container-lowest dark:bg-primary-container h-screen w-64 fixed left-0 top-0 shadow-sm p-gutter z-40 border-r border-outline-variant/20">
<div class="mb-12">
<h1 class="font-display-lg text-headline-md text-primary dark:text-primary-fixed tracking-tight">Ethos Atelier</h1>
<p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Curated Wardrobe</p>
</div>
<div class="flex-1 space-y-2">
<!-- Wardrobe (Inactive) -->
<a class="flex items-center gap-4 px-4 py-3 text-on-surface-variant dark:text-on-primary-container hover:bg-secondary-container/30 dark:hover:bg-secondary/10 transition-colors rounded-lg group" href="#">
<span class="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">checkroom</span>
<span class="font-body-lg text-body-lg group-hover:text-primary transition-colors">Wardrobe</span>
</a>
<!-- AI Stylist (Active) -->
<a class="flex items-center gap-4 px-4 py-3 text-primary dark:text-primary-fixed font-bold bg-secondary-container/50 dark:bg-secondary/20 rounded-lg scale-95 transition-transform" href="#">
<span class="material-symbols-outlined filled text-[20px]">auto_fix_high</span>
<span class="font-body-lg text-body-lg">AI Stylist</span>
</a>
<!-- Social Feed (Inactive) -->
<a class="flex items-center gap-4 px-4 py-3 text-on-surface-variant dark:text-on-primary-container hover:bg-secondary-container/30 dark:hover:bg-secondary/10 transition-colors rounded-lg group" href="#">
<span class="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">grid_view</span>
<span class="font-body-lg text-body-lg group-hover:text-primary transition-colors">Social Feed</span>
</a>
<!-- Marketplace (Inactive) -->
<a class="flex items-center gap-4 px-4 py-3 text-on-surface-variant dark:text-on-primary-container hover:bg-secondary-container/30 dark:hover:bg-secondary/10 transition-colors rounded-lg group" href="#">
<span class="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">storefront</span>
<span class="font-body-lg text-body-lg group-hover:text-primary transition-colors">Marketplace</span>
</a>
</div>
<div class="mt-auto space-y-4">
<button class="w-full bg-primary text-on-primary font-body-lg text-body-lg font-medium py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
<span class="material-symbols-outlined text-[20px]">add</span> Upload Item
            </button>
<div class="pt-4 border-t border-outline-variant/30 flex justify-around">
<a class="text-on-surface-variant hover:text-primary transition-colors p-2" href="#"><span class="material-symbols-outlined text-[20px]">settings</span></a>
<a class="text-on-surface-variant hover:text-primary transition-colors p-2" href="#"><span class="material-symbols-outlined text-[20px]">help_outline</span></a>
</div>
<div class="flex items-center gap-3 pt-2">
<div class="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
<img alt="User profile" class="w-full h-full object-cover" data-alt="A small, soft-focus portrait of a woman looking away, used as a subtle user profile avatar in a luxury minimal interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKFvTiu138-uU7Zk5IfLDxDMIVy-Bj4Iwo3UV7HpmrwXuPJaC0sbvWPzwp-YUgfKqrge5vfiTUI7Fnm7lWg9WxiG2jS8hAA6g7TC-_RH_yY5_2vK3tokaxrWYFki_ZyAuSGzSur_gOP4loNHpmGDzVp34EYOqIbmDglD6lGCR2-BiLtb7JpS0mQ6694lDwLRI6BrBY5-cCl94vh8N2KeDJeyRjOIVUbEqf_ocEwuHrEHQfSWGUBd0E-H_gphi3EhMml9ZSLN55vWw"/>
</div>
</div>
</div>
</nav>
<!-- Mobile Top App Bar -->
<header class="md:hidden flex justify-between items-center w-full px-margin-mobile py-4 bg-background dark:bg-primary fixed top-0 left-0 z-40">
<h1 class="font-display-lg text-headline-md-mobile text-primary dark:text-primary-fixed tracking-tight">Ethos Atelier</h1>
<div class="flex items-center gap-4 text-on-surface-variant">
<span class="material-symbols-outlined">shopping_bag</span>
<span class="material-symbols-outlined">chat_bubble</span>
<span class="material-symbols-outlined">notifications</span>
<div class="w-8 h-8 rounded-full bg-surface-container overflow-hidden ml-2">
<img alt="User profile portrait" class="w-full h-full object-cover" data-alt="A small, soft-focus portrait of a woman looking away, used as a subtle user profile avatar in a luxury minimal interface." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOt86qSVnlyajqik6EWas25TTqKHCoSaEuw1MYP6AKsmLmTHhPWSp8XxNq4lGQlkn1zOtMZDmi43NWCjERC0HeA44WVGft5qEQYeMHhwwe-GDVdWJdopj4atG8Q0fXY0uz64-FwrAQmjB5afcmGmXRvGYrckF2eIh1lqcg0Eygbk0ARQBjDd93PXN2xZ9vo3jzJRJat-p0nxMJ-_pVMlr3HjM7MFQPozkrzZvslVky2nyN_8gtCsje1fi3TX0xrVE1OJKupANxMaI"/>
</div>
</div>
</header>
<!-- Main Content Canvas -->
<main class="flex-1 md:ml-64 relative pt-24 md:pt-12 pb-32 md:pb-12 min-h-screen flex flex-col">
<div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full flex-1 flex flex-col">
<!-- Page Header -->
<div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
<div>
<h2 class="font-display-lg-mobile md:font-display-lg text-primary mb-2">Today's Curated Look</h2>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl">Optimized for your schedule and local conditions, drawing from your conscious wardrobe.</p>
</div>
<!-- Context Chips -->
<div class="flex flex-wrap gap-3">
<div class="bg-surface-container text-on-surface font-label-caps text-label-caps px-4 py-2 rounded-full flex items-center gap-2 border border-outline-variant/20">
<span class="material-symbols-outlined text-[16px] text-secondary">sunny</span>
<span>Sunny, 24°C</span>
</div>
<div class="bg-surface-container text-on-surface font-label-caps text-label-caps px-4 py-2 rounded-full flex items-center gap-2 border border-outline-variant/20">
<span class="material-symbols-outlined text-[16px] text-secondary">business_center</span>
<span>Office Days</span>
</div>
</div>
</div>
<!-- Bento Grid Layout -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter flex-1">
<!-- Left Column: Visual Outfit (Span 8) -->
<div class="lg:col-span-8 flex flex-col gap-gutter">
<!-- Main Flat-lay Hero -->
<div class="relative bg-surface-container-low rounded-xl overflow-hidden aspect-[4/3] md:aspect-[16/9] shadow-ambient group">
<img alt="Outfit Flat-lay" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A highly stylized, minimalist flat-lay fashion photograph of a women's summer work outfit. Features a tailored beige linen blazer, crisp white silk camisole, and wide-leg cream trousers, arranged neatly on a soft, textured off-white background. Soft, diffused natural lighting creates a high-end, editorial look typical of luxury conscious fashion brands. The color palette is strictly neutral, emphasizing texture and quality." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgb-9GhUsL5ThxlKE9i7E6cwgP9eU-d_MF3p_m8Gv3YMHzDG1IpqRLO0ODAfUTYhruPUK5FCS4ZVxawYkeZgRDBdSepejgdXq2SQV_SurHt3o7PNWQCoLYMI6uWfx-FFL1_eBD1i45c8MJglx1mZlR1oPZMxJzZgpJMnQjDdNsW_OOPB41FyMIsGM4hGp3Ush0nMIgpQ0aTPI9tD888KFttjMjBxzlVKM7uXeLcHvdGnqzg4c1TFbR4Lx-D6OlH4_W-WvyCIwdVgk"/>
<!-- Overlay gradient for luxury feel -->
<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<button class="absolute bottom-6 right-6 bg-surface-container-lowest/90 backdrop-blur-md text-primary p-3 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center">
<span class="material-symbols-outlined">zoom_in</span>
</button>
</div>
<!-- Individual Items Breakdown -->
<div>
<h3 class="font-title-lg text-title-lg text-primary mb-4">Comprised Of</h3>
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
<!-- Item 1 -->
<div class="bg-surface-container-lowest p-3 rounded-lg shadow-ambient border border-surface-container hover:border-outline-variant/50 transition-colors cursor-pointer">
<div class="aspect-square rounded-md bg-surface-container-low mb-3 overflow-hidden">
<img alt="Linen Blazer" class="w-full h-full object-cover mix-blend-multiply" data-alt="Close-up product shot of a tailored beige linen blazer on a pristine white background. Studio lighting highlights the natural texture of the sustainable fabric. Minimalist and clean aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ0lti_lykgDsfbjNHTEiYPcstAhYAJGENTn_8cRgL5s65k89uXCuSOht8MxCeBvg816ioLzYlDUKpI5zZoGI_uu5kskg7Ptp7vUUdyN91ajxpQyiuQTxDF52GacdhzX6uoMAljTE8ZqZJekoQxDuYLT6A0saFuVZLhNs-FsWfRYQixPh-tTKu1g7U9NL1mbI4JGzZY9shDp6PqxVcCbLceY0IyA2lib7vw7_8W6w_YmN41PApeUAElkPAe7U8uY2nN05CrEyYSfA"/>
</div>
<p class="font-label-caps text-[10px] text-secondary mb-1">Organic Linen</p>
<p class="font-body-sm text-body-sm text-primary font-medium truncate">Structured Blazer</p>
</div>
<!-- Item 2 -->
<div class="bg-surface-container-lowest p-3 rounded-lg shadow-ambient border border-surface-container hover:border-outline-variant/50 transition-colors cursor-pointer">
<div class="aspect-square rounded-md bg-surface-container-low mb-3 overflow-hidden">
<img alt="Silk Camisole" class="w-full h-full object-cover mix-blend-multiply" data-alt="Product shot of a delicate, pristine white silk camisole top against a soft neutral background. The lighting is soft and flattering, emphasizing the drape and sheen of the luxurious, conscious fabric." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFkr_4GoVG1aMoaXyg9-4dOYb4gQBDbSQ4Vskkg8zpuyRoHA5AizMwRYzaNJpOu-HTZIUPRDaC3w0cA3A_ZppccbUKKha-3xappmXhiVZgqm32TAUN2pvkAa2xuYr-Bzv26PAGzEYvOuWheV7d3SlhPJrAYWv5-hL8yRM7JMStKswWHKRAw0-CfZrRds5EnFOIoyqfNJvUMOlB7gj60JqiV_hN07oCHcDTIPbm4aJq_oFyFgeFPSXjr69EiW2rixnXvHRZJG6mJEM"/>
</div>
<p class="font-label-caps text-[10px] text-secondary mb-1">Upcycled Silk</p>
<p class="font-body-sm text-body-sm text-primary font-medium truncate">Draped Camisole</p>
</div>
<!-- Item 3 -->
<div class="bg-surface-container-lowest p-3 rounded-lg shadow-ambient border border-surface-container hover:border-outline-variant/50 transition-colors cursor-pointer">
<div class="aspect-square rounded-md bg-surface-container-low mb-3 overflow-hidden">
<img alt="Wide Leg Trousers" class="w-full h-full object-cover mix-blend-multiply" data-alt="Editorial product photograph of cream-colored wide-leg trousers folded elegantly. Shot from above on a clean, light-mode background with soft ambient shadows to show volume and tailoring quality." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAjCO5c6YXH_kg2Z05YUKNXSOZ1So5Z7mzX0A_QK1k2x7q11z21-YcfNIrWuhsFO6vFURv9qKGRYabPpQ2d_fb7Wc5UIbyBDyMmj_voc9mzsjeatP2nPxwk_CGawbiZs9EycpBYKAv7tcGLmHlBBNHslAU_aKqkeaX4nXRhHoeqwA-fPhNn5G5iIUuAkg7WolMTSYEF5jdRpUPqj3YEsmWSk3i1g5bvrFD4otuVI0d2uGDKnDPGp0KNv9dzepczMQRe0aCfPNa01U"/>
</div>
<p class="font-label-caps text-[10px] text-secondary mb-1">Tencel Blend</p>
<p class="font-body-sm text-body-sm text-primary font-medium truncate">Flow Trousers</p>
</div>
<!-- Item 4 -->
<div class="bg-surface-container-lowest p-3 rounded-lg shadow-ambient border border-surface-container hover:border-outline-variant/50 transition-colors cursor-pointer">
<div class="aspect-square rounded-md bg-surface-container-low mb-3 overflow-hidden flex items-center justify-center">
<img alt="Leather Loafers" class="w-full h-full object-cover mix-blend-multiply" data-alt="Minimalist shot of cream-colored leather loafers, showcasing refined craftsmanship. Placed on an off-white surface with gentle studio lighting. The aesthetic is clean, timeless, and sophisticated." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXXqUlhyepBsniCXWPaJC8EsBHofr0KjGrdT2juBazb13fYbjGNUl_yANyRQeafkYAt_2QjMFCvlRAXuDEatVRoY9CiSmWxusbfXi9D7lQCJHO9kwzOX2afDpEv4c-Zu63Rz19HNgY2ONVQwsGYRFUJjNJ8SmyxRiYVPC9T_aZLi9feWf6bN5K312c4hH_uUmUjUtePJWXFt6oD4JUUVW5nUWPCFtRh8u6bLRyfJ_GPLZLLd9MQHCokOl7TVVZCVq1OLoBdLZS1S4"/>
</div>
<p class="font-label-caps text-[10px] text-secondary mb-1">Vegan Leather</p>
<p class="font-body-sm text-body-sm text-primary font-medium truncate">Classic Loafer</p>
</div>
</div>
</div>
</div>
<!-- Right Column: AI Chat Interface (Span 4) -->
<!-- Applying the style guidance: "slide-over panel (drawer) using a Soft Beige surface with high-diffusion backdrop blur (20px)" adapted for grid -->
<div class="lg:col-span-4 h-[600px] lg:h-auto rounded-xl shadow-lg border border-outline-variant/20 bg-surface-container-lowest/80 backdrop-blur-[20px] flex flex-col overflow-hidden relative">
<!-- Chat Header -->
<div class="p-6 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest/50">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
<span class="material-symbols-outlined">auto_awesome</span>
</div>
<div>
<h3 class="font-title-lg text-[18px] text-primary">Ethos AI</h3>
<p class="font-body-sm text-[12px] text-on-surface-variant">Your Personal Stylist</p>
</div>
</div>
<button class="text-on-surface-variant hover:text-primary transition-colors">
<span class="material-symbols-outlined">more_horiz</span>
</button>
</div>
<!-- Chat Messages Area -->
<div class="flex-1 p-6 overflow-y-auto no-scrollbar space-y-6 flex flex-col bg-surface/30">
<!-- AI Message -->
<div class="flex flex-col gap-1 max-w-[85%]">
<div class="bg-surface-container-low text-on-surface p-4 rounded-2xl rounded-tl-none font-body-sm text-[15px] leading-relaxed shadow-sm">
                                Good morning. Based on today's forecast of 24°C and your schedule showing office hours followed by a light dinner, I've curated a breathable, structured look. The linen blend will keep you comfortable, while the tailoring maintains a professional silhouette.
                            </div>
<span class="text-[11px] text-on-surface-variant/60 ml-2">Just now</span>
</div>
<!-- User Message -->
<div class="flex flex-col gap-1 max-w-[85%] self-end items-end">
<div class="bg-primary text-on-primary p-4 rounded-2xl rounded-tr-none font-body-sm text-[15px] leading-relaxed shadow-sm">
                                I love the silhouette. Could we swap the heels for something flatter? I'll be walking quite a bit.
                            </div>
<span class="text-[11px] text-on-surface-variant/60 mr-2">1 min ago</span>
</div>
<!-- AI Message (Typing Indicator) -->
<div class="flex flex-col gap-1 max-w-[85%]">
<div class="bg-surface-container-low text-on-surface p-4 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-sm w-16">
<div class="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style="animation-delay: 0ms"></div>
<div class="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style="animation-delay: 150ms"></div>
<div class="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style="animation-delay: 300ms"></div>
</div>
</div>
</div>
<!-- Chat Input -->
<div class="p-4 bg-surface-container-lowest/80 border-t border-outline-variant/20">
<div class="relative flex items-center">
<!-- Minimalist input field per style guidance: bottom border resting, full container focus (handled via group/peer in tailwind) -->
<input class="w-full bg-transparent border-0 border-b border-outline-variant/50 focus:border-transparent focus:ring-0 px-0 py-3 font-body-sm text-primary placeholder:text-on-surface-variant/50 transition-all peer focus:bg-surface-container-low focus:px-4 focus:rounded-lg" placeholder="Ask to adjust color, formality, or items..." type="text"/>
<button class="absolute right-2 text-primary opacity-50 hover:opacity-100 transition-opacity peer-focus:right-4">
<span class="material-symbols-outlined text-[20px]">send</span>
</button>
</div>
</div>
</div>
</div>
<!-- Bottom Actions (e.g., Save Look) -->
<div class="mt-8 flex justify-end gap-4 border-t border-outline-variant/20 pt-6">
<button class="px-8 py-3 rounded-none border border-secondary text-secondary font-body-lg text-[15px] font-medium hover:bg-secondary/5 transition-colors min-h-[48px]">
                    Regenerate
                </button>
<button class="px-8 py-3 rounded-none bg-primary text-on-primary font-body-lg text-[15px] font-medium hover:bg-primary/90 transition-colors shadow-ambient min-h-[48px]">
                    Save Look to Wardrobe
                </button>
</div>
</div>
</main>
<!-- Mobile Bottom Navigation Bar -->
<nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container-lowest/80 dark:bg-primary-container/80 backdrop-blur-xl rounded-t-xl shadow-lg border-t border-outline-variant/30">
<!-- Wardrobe (Inactive) -->
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 dark:text-on-primary-container/60 hover:text-primary transition-colors" href="#">
<span class="material-symbols-outlined text-[24px] mb-1">checkroom</span>
<span class="font-label-caps text-label-caps">Wardrobe</span>
</a>
<!-- Stylist (Active) -->
<a class="flex flex-col items-center justify-center text-primary dark:text-primary-fixed font-bold scale-90 transition-transform duration-200" href="#">
<span class="material-symbols-outlined filled text-[24px] mb-1">auto_fix_high</span>
<span class="font-label-caps text-label-caps">Stylist</span>
</a>
<!-- Social (Inactive) -->
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 dark:text-on-primary-container/60 hover:text-primary transition-colors" href="#">
<span class="material-symbols-outlined text-[24px] mb-1">grid_view</span>
<span class="font-label-caps text-label-caps">Social</span>
</a>
<!-- Market (Inactive) -->
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 dark:text-on-primary-container/60 hover:text-primary transition-colors" href="#">
<span class="material-symbols-outlined text-[24px] mb-1">sell</span>
<span class="font-label-caps text-label-caps">Market</span>
</a>
</nav>
</body></html>


=============================
<!DOCTYPE html>

<html class="light" lang="en" style=""><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Closy - Social Feed</title>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300..900&amp;family=Playfair+Display:wght@400..900&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .icon-fill {
            font-variation-settings: 'FILL' 1;
        }
        
        /* Custom Scrollbar for elegant feel */
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background-color: #c4c7c7; /* outline-variant */
            border-radius: 10px;
        }
    </style>
<!-- Tailwind CSS & Configuration -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-tertiary-fixed": "#0b1f18",
                    "tertiary-fixed": "#d1e8dd",
                    "surface-container-low": "#f4f4f2",
                    "outline-variant": "#c4c7c7",
                    "inverse-primary": "#c8c6c6",
                    "surface": "#f9f9f7",
                    "secondary-container": "#e1e1c9",
                    "primary-fixed-dim": "#c8c6c6",
                    "inverse-surface": "#2f3130",
                    "background": "#f9f9f7",
                    "on-error-container": "#93000a",
                    "on-tertiary": "#ffffff",
                    "surface-dim": "#dadad8",
                    "inverse-on-surface": "#f1f1ef",
                    "primary-container": "#2d2d2d",
                    "surface-container": "#eeeeec",
                    "on-primary-container": "#959494",
                    "on-secondary-fixed-variant": "#474836",
                    "on-secondary": "#ffffff",
                    "on-surface": "#1a1c1b",
                    "outline": "#747878",
                    "on-tertiary-container": "#849990",
                    "tertiary": "#081c15",
                    "on-surface-variant": "#444748",
                    "on-secondary-container": "#636451",
                    "surface-tint": "#5f5e5e",
                    "tertiary-fixed-dim": "#b5ccc1",
                    "surface-container-highest": "#e2e3e1",
                    "error-container": "#ffdad6",
                    "on-primary-fixed-variant": "#474747",
                    "surface-container-lowest": "#ffffff",
                    "secondary-fixed": "#e4e4cc",
                    "on-error": "#ffffff",
                    "tertiary-container": "#1d312a",
                    "surface-container-high": "#e8e8e6",
                    "surface-bright": "#f9f9f7",
                    "on-secondary-fixed": "#1b1d0e",
                    "primary-fixed": "#e4e2e1",
                    "on-primary": "#ffffff",
                    "error": "#ba1a1a",
                    "secondary": "#5e604d",
                    "primary": "#181919",
                    "on-background": "#1a1c1b",
                    "surface-variant": "#e2e3e1",
                    "secondary-fixed-dim": "#c8c8b0",
                    "on-primary-fixed": "#1b1c1c",
                    "on-tertiary-fixed-variant": "#374b43"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "margin-desktop": "64px",
                    "gutter": "24px",
                    "container-max": "1280px",
                    "section-gap": "80px",
                    "margin-mobile": "20px",
                    "unit": "8px"
            },
            "fontFamily": {
                    "title-lg": ["Rubik", "sans-serif"],
                    "headline-md-mobile": ["Playfair Display", "serif"],
                    "display-lg-mobile": ["Playfair Display", "serif"],
                    "body-lg": ["Rubik", "sans-serif"],
                    "label-caps": ["Rubik", "sans-serif"],
                    "headline-md": ["Playfair Display", "serif"],
                    "display-lg": ["Playfair Display", "serif"],
                    "body-sm": ["Rubik", "sans-serif"]
            },
            "fontSize": {
                    "title-lg": ["20px", {"lineHeight": "1.4", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "headline-md-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "500"}],
                    "display-lg-mobile": ["36px", {"lineHeight": "1.1", "fontWeight": "600"}],
                    "body-lg": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                    "label-caps": ["12px", {"lineHeight": "1", "letterSpacing": "0.1em", "fontWeight": "700"}],
                    "headline-md": ["32px", {"lineHeight": "1.2", "fontWeight": "500"}],
                    "display-lg": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                    "body-sm": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}]
            }
          }
        }
      }
    </script>
</head>
<body class="bg-background text-on-background font-body-lg antialiased selection:bg-secondary selection:text-on-secondary">
<!-- Mobile TopNav (md:hidden) -->
<nav class="md:hidden bg-surface dark:bg-surface-container-high text-primary dark:text-on-primary docked full-width top-0 bg-surface dark:bg-surface-container-high flat no shadows flex justify-between items-center w-full px-gutter py-4 sticky top-0 z-50">
<div class="font-display-lg-mobile text-display-lg-mobile text-primary dark:text-primary-fixed-dim">
            Closy
        </div>
<div class="flex items-center gap-4">
<button class="hover:text-primary transition-colors duration-200">
<span class="material-symbols-outlined text-[24px]">notifications</span>
</button>
<button class="hover:text-primary transition-colors duration-200">
<span class="material-symbols-outlined text-[24px]">person</span>
</button>
</div>
</nav>
<div class="flex h-screen overflow-hidden max-w-[1600px] mx-auto">
<!-- Desktop SideNavBar (hidden md:flex) -->
<aside class="hidden md:flex bg-surface-container-low dark:bg-surface-container-lowest text-primary dark:text-on-primary h-screen w-64 fixed left-0 top-0 bg-surface-container-low dark:bg-surface-container-lowest flat no shadows flex-col border-r border-outline-variant py-gutter z-40">
<div class="font-display-lg text-display-lg text-primary dark:text-primary-fixed-dim px-6 mb-8 flex flex-col">
                Closy
                <span class="font-body-sm text-body-sm text-on-surface-variant font-normal tracking-wide mt-1">Sustainable Fashion</span>
</div>
<nav class="flex-1 flex flex-col gap-2 mt-4">
<!-- Wardrobe: Inactive -->
<a class="flex items-center gap-4 text-on-surface-variant p-4 hover:bg-surface-variant transition-colors group" href="#">
<span class="material-symbols-outlined group-hover:scale-110 transition-transform">checkroom</span>
<span class="font-title-lg text-title-lg text-[16px] font-normal">Wardrobe</span>
</a>
<!-- AI Stylist: Inactive -->
<a class="flex items-center gap-4 text-on-surface-variant p-4 hover:bg-surface-variant transition-colors group" href="#">
<span class="material-symbols-outlined group-hover:scale-110 transition-transform">auto_awesome</span>
<span class="font-title-lg text-title-lg text-[16px] font-normal">AI Stylist</span>
</a>
<!-- Social Feed: ACTIVE -->
<a class="flex items-center gap-4 text-primary font-bold border-l-4 border-secondary p-4 bg-secondary-container/10 transition-all" href="#">
<span class="material-symbols-outlined icon-fill">auto_stories</span>
<span class="font-title-lg text-title-lg text-[16px]">Social Feed</span>
</a>
<!-- Marketplace: Inactive -->
<a class="flex items-center gap-4 text-on-surface-variant p-4 hover:bg-surface-variant transition-colors group" href="#">
<span class="material-symbols-outlined group-hover:scale-110 transition-transform">storefront</span>
<span class="font-title-lg text-title-lg text-[16px] font-normal">Marketplace</span>
</a>
</nav>
<div class="px-6 mt-auto">
<button class="w-full bg-primary text-on-primary font-title-lg text-[16px] py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-container hover:shadow-[0_10px_30px_rgba(45,45,45,0.1)] transition-all duration-300">
<span class="material-symbols-outlined">add</span>
                    Upload Post
                </button>
</div>
</aside>
<!-- Main Content Area -->
<main class="flex-1 md:ml-64 flex overflow-hidden bg-background">
<!-- Gallery Feed Canvas -->
<div class="flex-1 overflow-y-auto px-gutter md:px-margin-desktop py-8 md:py-12 scroll-smooth">
<header class="mb-12 flex justify-between items-end max-w-2xl mx-auto">
<div>
<h1 class="font-headline-md md:font-display-lg text-headline-md md:text-display-lg text-primary mb-2">Curated Feed</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant">Inspiration from conscious creators.</p>
</div>
<!-- Mobile trigger for connections (hidden on desktop) -->
<button class="md:hidden text-primary flex items-center gap-2 font-label-caps text-label-caps uppercase tracking-widest border-b border-primary pb-1">
                        Connections <span class="material-symbols-outlined text-[18px]">group</span>
</button>
</header>
<!-- Single Column Vertical Feed -->
<div class="flex flex-col gap-12 max-w-2xl mx-auto">
<!-- Post 1 -->
<article class="group relative rounded-xl overflow-hidden bg-surface shadow-sm hover:shadow-[0_10px_30px_rgba(45,45,45,0.08)] transition-all duration-500 flex flex-col border border-outline-variant/30">
<div class="p-6 bg-surface z-10 flex items-center justify-between border-b border-outline-variant/30">
<div class="flex items-center gap-4">
<img class="w-10 h-10 rounded-full object-cover" data-alt="Portrait of a young woman with a natural, minimal makeup look, wearing a simple organic cotton top. The lighting is soft and flattering, fitting a refined, elegant aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW7uVjEnDtiDgusPtagkv7bEd-nC-vGk8XUjyr2kAglFizI-BY6P_sbRVXQWppiCL5SMcwQUYYPRup1uohYMycVJyho1Kc0MBdDvveppYJ3R2BWBcltMfuTesRWVMOdxnLXs1uOdHHMcQ1AIOiFSv3K9fraJRSXzcpwjcA-5Df6TDup0K7_BBhX99yMGgsbntJfi_99Q75ycHE_Z7DHHecqvPbPPgnyawUV4sGBRkO0PCMx94pLTUnc2Df0MHIxwg6QgfgpamQRIQ"/>
<div>
<h3 class="font-title-lg text-[14px] leading-tight text-primary">Elena Rostova</h3>
<p class="font-body-sm text-[12px] text-on-surface-variant">Organic Linen Collection</p>
</div>
</div>
<span class="font-label-caps text-[10px] text-secondary tracking-widest bg-secondary-container/30 px-3 py-1 rounded-full">Vintage</span>
</div>
<div class="relative w-full aspect-[4/5] overflow-hidden">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="A high-end editorial fashion shot featuring a model wearing a minimalist, tailored linen suit in a muted beige color. The setting is a bright, sunlit minimalist studio with pristine white walls and soft shadows. The overall aesthetic is calm, sustainable, and sophisticated, reflecting a premium light-mode UI color palette with neutral tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDe5rfgF6rg5Rb1S1QdM7BluR9eDe1gYAOTZ_MCGP6tb5ktCHnWR_A06eSFaxaAypXh1_HXI-Qx85AE_Y8_eb31urUoNxgzjc0PhhI3GhJ1LiyC-u4t6HzSCeru15FbFIcZw3MjTtL9rLAf6yV2WlrnoFlViWBNvmXVVMjsKpFWcIx5hEWowkCfIlHkth0Uuri9mdYV7emZ1jc0AW-Ab7yo1mlmeJrPRtejDOc_HjWUgRdCl3p9lT_tedjKgJW3axOBjVKogBD31cQ"/>
<!-- Overlay Gradient -->
<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
<!-- Actions Overlay -->
<div class="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
<button class="w-12 h-12 rounded-full bg-surface/90 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors">
<span class="material-symbols-outlined">favorite</span>
</button>
<button class="w-12 h-12 rounded-full bg-surface/90 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors" title="Save to Wardrobe">
<span class="material-symbols-outlined">checkroom</span>
</button>
</div>
</div>
<div class="px-6 py-4 bg-surface flex flex-col gap-4"><div class="flex items-center justify-between"><div class="flex items-center gap-6"><div class="flex items-center gap-2 cursor-pointer group/icon"><span class="material-symbols-outlined text-[24px] text-on-surface-variant group-hover/icon:text-error transition-colors">favorite</span><span class="font-body-sm text-[14px] text-on-surface-variant">128</span></div><div class="flex items-center gap-2 cursor-pointer group/icon"><span class="material-symbols-outlined text-[24px] text-on-surface-variant group-hover/icon:text-primary transition-colors">chat_bubble</span><span class="font-body-sm text-[14px] text-on-surface-variant">24</span></div></div><div class="flex items-center gap-4"><span class="material-symbols-outlined text-[24px] text-on-surface-variant cursor-pointer hover:text-primary transition-colors">share</span><span class="material-symbols-outlined text-[24px] text-on-surface-variant cursor-pointer hover:text-primary transition-colors">bookmark</span></div></div><div class="mt-2"><p class="font-body-sm text-[14px] text-on-surface-variant"><span class="font-bold text-primary mr-2">Elena Rostova</span>Loving the new textures and fits from the organic linen collection. Sustainability has never looked this crisp. 🌿🤍</p></div><div class="bg-surface-container-low/50 p-4 rounded-lg mt-2"><p class="font-body-sm text-[13px] text-on-surface-variant"><span class="font-bold text-primary">@lucas_style:</span> The texture on that blazer is incredible!</p></div></div>
</article>
<!-- Post 2: Standard Square -->
<article class="group relative rounded-xl overflow-hidden bg-surface shadow-sm hover:shadow-[0_10px_30px_rgba(45,45,45,0.08)] transition-all duration-500 flex flex-col border border-outline-variant/30">
<div class="p-6 bg-surface z-10 flex items-center justify-between border-b border-outline-variant/30">
<div class="flex items-center gap-4">
<img class="w-10 h-10 rounded-full object-cover" data-alt="Studio_A logo or portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA09IvcGdVpOLcdiIx-IUMhQ0EFOYgRK3v0BpwFbMfJeVkVMbEPkB5LWXLzYQd3vGq5G2TeQTbZo1si0qzb3wV9KeiMd3JC0ev5Ga8zvGL3kkOgJ9PhXGSLdJivobD-rsmYvIHVgW9vKGyI49Sf5uJuJ6bONqUzWJ11nDA4GmDcNFn02NCQFDo6qT0lNTNkEuBfeG3Nlz0wX2y4ULtQKKo7yGun4Mv7XC60rKKePLzb-AAwQGP31aIR3QTY63HS9eBcIqzMW0y1-BM"/>
<div>
<h3 class="font-title-lg text-[14px] leading-tight text-primary">Studio_A</h3>
<p class="font-body-sm text-[12px] text-on-surface-variant">Accessories</p>
</div>
</div>
<span class="material-symbols-outlined text-outline cursor-pointer">more_horiz</span>
</div>
<div class="relative w-full aspect-square overflow-hidden">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="A flat lay photograph of carefully curated eco-friendly accessories: a cork leather wallet, minimalist silver rings, and a canvas tote bag. They rest on a pristine white marble surface with soft, diffused lighting. The aesthetic is clean, organized, and sophisticated." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQJ-d_AQTUjRCGw4yzyHfldqqxkze0l4Al9XxcsLLAByiGK1Ct7IWiqe7FfhGfGFhKA5NDteccAWhGUrUNlEk6FSaj3NxPFDV58D9-ccgIpJiSNmSdkZNisCemmaEQf8ojpwPWLtT_Q2QtCW3QpE1lauswiJnVUtNY-bsS2FqWHQUXibRnjZSt1dmNIC6anOHYlrJgtQh9dn3ZDvvpnLgpGfjdQmTUz-KYEkL9h-tS2uIDBc8_Sp8rn_-Ci0dGCwKSfOCQOsfNq4s"/>
</div>
<div class="px-6 py-4 bg-surface flex flex-col gap-4"><div class="flex items-center justify-between"><div class="flex items-center gap-6"><div class="flex items-center gap-2 cursor-pointer group/icon"><span class="material-symbols-outlined text-[24px] text-on-surface-variant group-hover/icon:text-error transition-colors">favorite</span><span class="font-body-sm text-[14px] text-on-surface-variant">210</span></div><div class="flex items-center gap-2 cursor-pointer group/icon"><span class="material-symbols-outlined text-[24px] text-on-surface-variant group-hover/icon:text-primary transition-colors">chat_bubble</span><span class="font-body-sm text-[14px] text-on-surface-variant">18</span></div></div><div class="flex items-center gap-4"><span class="material-symbols-outlined text-[24px] text-on-surface-variant cursor-pointer hover:text-primary transition-colors">share</span><span class="material-symbols-outlined text-[24px] text-on-surface-variant cursor-pointer hover:text-primary transition-colors">bookmark</span></div></div><div class="mt-2"><p class="font-body-sm text-[14px] text-on-surface-variant"><span class="font-bold text-primary mr-2">Studio_A</span>Essentials redefined. Cork leather combined with minimalist silver details. What's your daily carry?</p></div></div>
</article>
<!-- Post 3: Standard Wide -->
<article class="group relative rounded-xl overflow-hidden bg-surface shadow-sm hover:shadow-[0_10px_30px_rgba(45,45,45,0.08)] transition-all duration-500 flex flex-col border border-outline-variant/30">
<div class="p-6 bg-surface z-10 flex items-center justify-between border-b border-outline-variant/30">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-title-lg">CS</div>
<div>
<h3 class="font-title-lg text-[14px] leading-tight text-primary">Community Spotlight</h3>
<p class="font-body-sm text-[12px] text-on-surface-variant">Editorial</p>
</div>
</div>
<span class="material-symbols-outlined text-outline cursor-pointer">more_horiz</span>
</div>
<div class="relative w-full aspect-[16/10] overflow-hidden">
<img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="A model walking down a sunlit city street wearing a flowing, asymmetrical dress made from recycled materials. The architecture around is modern and clean. The color palette leans towards warm earth tones and crisp whites, embodying an elegant, conscious lifestyle." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHhEA7REjlvAos21e2jZ3-EZGNovuNd7dKOY2Ku_539WCJyhuGRdqyQFMMlxtPIxcb8ePPEpmYnC4M0MkBRq1Az1PG2hQUzyJNaRkjcCyhfh65LAwKbX-nlINu5GX2Fvhjtex-Lj_vD9bAVxyzv9ntpi-aUBfCLgRbsR0znttHe8o36zlJE6ceCUahrsvwVOCUy9TSzoABiKmJ5F8D3WmLoCPdaGaPD9M2gvvTkF9ySuBY7i3GxxUbZ67gZtsQQhEJSaPZ_QjaqTs"/>
</div>
<div class="px-6 py-6 bg-surface-container-low flex flex-col gap-4">
<div>
<h2 class="font-headline-md text-[24px] text-primary mb-2 leading-snug">The Silhouette of Tomorrow</h2>
<p class="font-body-sm text-[15px] text-on-surface-variant">How structural design is reshaping zero-waste fashion patterns and redefining modern city wear.</p>
</div>
<div class="mt-4 pt-4 border-t border-outline-variant/30 flex items-center justify-between"><div class="flex items-center gap-6"><div class="flex items-center gap-2 cursor-pointer group/icon"><span class="material-symbols-outlined text-[24px] text-on-surface-variant group-hover/icon:text-error transition-colors">favorite</span><span class="font-body-sm text-[14px] text-on-surface-variant">342</span></div><div class="flex items-center gap-2 cursor-pointer group/icon"><span class="material-symbols-outlined text-[24px] text-on-surface-variant group-hover/icon:text-primary transition-colors">chat_bubble</span><span class="font-body-sm text-[14px] text-on-surface-variant">56</span></div></div><div class="flex items-center gap-4"><span class="material-symbols-outlined text-[24px] text-on-surface-variant cursor-pointer hover:text-primary transition-colors">share</span><span class="material-symbols-outlined text-[24px] text-on-surface-variant cursor-pointer hover:text-primary transition-colors">bookmark</span></div></div>
</div>
</article>
</div>
<!-- Spacer for bottom -->
<div class="h-24 md:h-12"></div>
</div>
<!-- Right Sidebar: Connections (hidden on mobile, visible on lg) -->
<aside class="hidden lg:flex w-80 bg-surface border-l border-outline-variant flex-col h-full sticky top-0">
<div class="p-6 border-b border-outline-variant/50">
<h2 class="font-headline-md text-[22px] text-primary">Connections</h2>
<p class="font-body-sm text-on-surface-variant mt-1">Your conscious circle</p>
</div>
<div class="p-6 overflow-y-auto flex-1">
<!-- Search minimal -->
<div class="relative mb-8">
<span class="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
<input class="w-full bg-transparent border-0 border-b border-outline-variant focus:border-primary focus:ring-0 pl-8 pb-2 font-body-sm text-primary placeholder:text-outline transition-colors" placeholder="Find creators..." type="text"/>
</div>
<div class="space-y-6">
<!-- Connection 1 -->
<div class="flex items-center justify-between group">
<div class="flex items-center gap-3">
<img class="w-10 h-10 rounded-full object-cover" data-alt="Portrait of a woman smiling subtly, wearing round tortoise-shell glasses and a beige turtleneck. High key lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVmMYLmeTdGkQOY0Y1hxQOteZosrB5vQW-m71mNsMw9Jty6fFVdRdCex6V1uK3KWXFkGNcMwHAz2lF9nfygavyuu2nw7iFjFZOlJl3x0uq51CKM8HAHVIUEmwy1sX8PCBN6lsHZBd4OOLJ0iQ4YgCBBhJHaKStX_Z4ehYQcOUlcF_K_FF8aBklc1yWjmUYMr-jexKkCY4szEK2-3vtZDVRXGUX2ZahW0KRV1YiUxxqk1KBeEsGEMcrRla4Jgwh8PGs1q00ws743bI"/>
<div>
<h4 class="font-title-lg text-[14px] text-primary group-hover:text-secondary transition-colors cursor-pointer">Sarah Jenkins</h4>
<p class="font-body-sm text-[12px] text-outline">@sarahj_style</p>
</div>
</div>
<button class="text-secondary hover:text-tertiary transition-colors">
<span class="material-symbols-outlined text-[20px]">more_horiz</span>
</button>
</div>
<!-- Connection 2 -->
<div class="flex items-center justify-between group">
<div class="flex items-center gap-3">
<img class="w-10 h-10 rounded-full object-cover" data-alt="Portrait of a man with a short beard, looking thoughtfully off-camera. Wearing a charcoal grey tailored coat." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIAWSsMeFUiNJWAyljmFVeuKXW1T5ZUnmxsd6h1VVxvemL9agvdDl6OJFeZeoxVG4zX3KgLS6o1cttikb-zy2F-N12K3XxYU7S-l6Q-8dKbn7GUm8x_qzWfLuzhmUrQmz_47j74JSsQV6B8HkAOT7RIPteBnScENJw0HRVWON6UnBMXsid3OBeLwD0I0Rc2wjVll_dsK5WQKQsZJwACrYJQox1H3tywQeLeJSlt8nL0I5Z67I6c7SNNokgj_pqiOI79_b_2x6cnZ8"/>
<div>
<h4 class="font-title-lg text-[14px] text-primary group-hover:text-secondary transition-colors cursor-pointer">David Chen</h4>
<p class="font-body-sm text-[12px] text-outline">@dchen_archive</p>
</div>
</div>
<button class="text-secondary hover:text-tertiary transition-colors">
<span class="material-symbols-outlined text-[20px]">more_horiz</span>
</button>
</div>
<!-- Connection 3 -->
<div class="flex items-center justify-between group">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-title-lg text-[14px]">LV</div>
<div>
<h4 class="font-title-lg text-[14px] text-primary group-hover:text-secondary transition-colors cursor-pointer">Lia V.</h4>
<p class="font-body-sm text-[12px] text-outline">@lia_vintage</p>
</div>
</div>
<button class="text-secondary hover:text-tertiary transition-colors">
<span class="material-symbols-outlined text-[20px]">more_horiz</span>
</button>
</div>
</div>
<h3 class="font-label-caps text-label-caps text-outline uppercase tracking-widest mt-10 mb-4">Suggested</h3>
<div class="space-y-6">
<!-- Suggested -->
<div class="flex items-center justify-between">
<div class="flex items-center gap-3">
<img class="w-10 h-10 rounded-full object-cover" data-alt="Portrait of a stylish individual in a well-lit studio, wearing avant-garde sustainable fashion pieces." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPS8msxZ3gCfXqvv1UcAsSQ01zPeqw203bdFXZaS59SWnkv8thgvZZkdTnuRwESJJzY9c2zA7C98kVHgU_X2dn048nBm5IGCmPjvjENF39QK1U7Fxy_9_-SEDl5pafTXkO5jeDZgP-gmWVv-NlnsKx3Pe0YKpQRNHDcJORvt1zN4CJ2Kb4tJjJ56MoyXYd2hKObLAFZ2xnax8yBVmj39Ek4PB_7o7Dy3H8-xNXl4jWAKiZUgjAs53kr1m1Nqx9KNrBSD7-ig9x-Xk"/>
<div>
<h4 class="font-title-lg text-[14px] text-primary">Aura Boutique</h4>
<p class="font-body-sm text-[12px] text-outline">Curated Pieces</p>
</div>
</div>
<button class="text-[12px] font-title-lg text-primary border border-primary px-3 py-1 rounded-full hover:bg-primary hover:text-on-primary transition-colors">
                                Follow
                            </button>
</div>
</div>
</div>
</aside>
</main>
</div>
</body></html>

================================

<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Marketplace - Ethos Atelier</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Playfair+Display:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "primary-fixed-dim": "#c8c6c6",
                    "on-error": "#ffffff",
                    "secondary-fixed-dim": "#c8c8b0",
                    "on-primary": "#ffffff",
                    "inverse-surface": "#2f3130",
                    "primary-container": "#2d2d2d",
                    "on-primary-container": "#959494",
                    "primary": "#181919",
                    "on-tertiary": "#ffffff",
                    "on-secondary": "#ffffff",
                    "on-surface-variant": "#444748",
                    "on-secondary-fixed-variant": "#474836",
                    "on-secondary-container": "#636451",
                    "on-secondary-fixed": "#1b1d0e",
                    "surface-container-low": "#f4f4f2",
                    "surface-container-lowest": "#ffffff",
                    "error-container": "#ffdad6",
                    "error": "#ba1a1a",
                    "on-surface": "#1a1c1b",
                    "secondary": "#5e604d",
                    "on-background": "#1a1c1b",
                    "surface-container": "#eeeeec",
                    "outline": "#747878",
                    "surface-dim": "#dadad8",
                    "secondary-fixed": "#e4e4cc",
                    "primary-fixed": "#e4e2e1",
                    "secondary-container": "#e1e1c9",
                    "on-tertiary-container": "#849990",
                    "on-tertiary-fixed-variant": "#374b43",
                    "tertiary-container": "#1d312a",
                    "inverse-primary": "#c8c6c6",
                    "background": "#f9f9f7",
                    "surface": "#f9f9f7",
                    "inverse-on-surface": "#f1f1ef",
                    "surface-bright": "#f9f9f7",
                    "surface-container-high": "#e8e8e6",
                    "on-tertiary-fixed": "#0b1f18",
                    "tertiary": "#081c15",
                    "on-primary-fixed": "#1b1c1c",
                    "outline-variant": "#c4c7c7",
                    "tertiary-fixed": "#d1e8dd",
                    "tertiary-fixed-dim": "#b5ccc1",
                    "surface-tint": "#5f5e5e",
                    "surface-variant": "#e2e3e1",
                    "surface-container-highest": "#e2e3e1",
                    "on-error-container": "#93000a",
                    "on-primary-fixed-variant": "#474747"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "spacing": {
                    "margin-mobile": "20px",
                    "gutter": "24px",
                    "unit": "8px",
                    "margin-desktop": "64px",
                    "container-max": "1280px",
                    "section-gap": "80px"
            },
            "fontFamily": {
                    "label-caps": ["Inter"],
                    "body-lg": ["Inter"],
                    "title-lg": ["Inter"],
                    "headline-md-mobile": ["Playfair Display"],
                    "display-lg-mobile": ["Playfair Display"],
                    "body-sm": ["Inter"],
                    "display-lg": ["Playfair Display"],
                    "headline-md": ["Playfair Display"]
            },
            "fontSize": {
                    "label-caps": ["12px", {"lineHeight": "1", "letterSpacing": "0.1em", "fontWeight": "700"}],
                    "body-lg": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                    "title-lg": ["20px", {"lineHeight": "1.4", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                    "headline-md-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "500"}],
                    "display-lg-mobile": ["36px", {"lineHeight": "1.1", "fontWeight": "600"}],
                    "body-sm": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                    "display-lg": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600"}],
                    "headline-md": ["32px", {"lineHeight": "1.2", "fontWeight": "500"}]
            }
          }
        }
      }
    </script>
<style>
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        /* Custom scrollbar for a cleaner look */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #e2e3e1; 
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #c4c7c7; 
        }
    </style>
</head>
<body class="bg-background text-on-background font-body-lg antialiased flex selection:bg-secondary-container selection:text-on-secondary-container">
<!-- SideNavBar (Desktop Only) -->
<nav class="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest dark:bg-primary-container shadow-sm p-gutter z-40 border-r border-outline-variant/20">
<div class="mb-section-gap">
<h1 class="font-display-lg text-headline-md text-primary dark:text-primary-fixed tracking-tight">Ethos Atelier</h1>
<p class="font-label-caps text-label-caps text-on-surface-variant mt-2 opacity-80">Curated Wardrobe</p>
</div>
<button class="w-full bg-primary text-on-primary font-body-lg text-body-lg rounded-full py-3 mb-8 flex items-center justify-center gap-2 hover:bg-inverse-surface transition-colors duration-300">
<span class="material-symbols-outlined" style="font-size: 20px;">add</span>
            Upload Item
        </button>
<ul class="flex flex-col gap-2 flex-grow">
<li>
<a class="flex items-center gap-4 px-4 py-3 text-on-surface-variant dark:text-on-primary-container hover:bg-secondary-container/30 dark:hover:bg-secondary/10 transition-colors rounded-lg font-body-lg text-body-lg" href="#">
<span class="material-symbols-outlined">checkroom</span>
                    Wardrobe
                </a>
</li>
<li>
<a class="flex items-center gap-4 px-4 py-3 text-on-surface-variant dark:text-on-primary-container hover:bg-secondary-container/30 dark:hover:bg-secondary/10 transition-colors rounded-lg font-body-lg text-body-lg" href="#">
<span class="material-symbols-outlined">auto_fix_high</span>
                    AI Stylist
                </a>
</li>
<li>
<a class="flex items-center gap-4 px-4 py-3 text-on-surface-variant dark:text-on-primary-container hover:bg-secondary-container/30 dark:hover:bg-secondary/10 transition-colors rounded-lg font-body-lg text-body-lg" href="#">
<span class="material-symbols-outlined">grid_view</span>
                    Social Feed
                </a>
</li>
<li>
<a class="flex items-center gap-4 px-4 py-3 text-primary dark:text-primary-fixed font-bold bg-secondary-container/50 dark:bg-secondary/20 rounded-lg font-body-lg text-body-lg" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">storefront</span>
                    Marketplace
                </a>
</li>
</ul>
<ul class="flex flex-col gap-2 mt-auto pt-8 border-t border-outline-variant/20">
<li>
<a class="flex items-center gap-4 px-4 py-3 text-on-surface-variant dark:text-on-primary-container hover:bg-secondary-container/30 dark:hover:bg-secondary/10 transition-colors rounded-lg font-body-lg text-body-lg" href="#">
<span class="material-symbols-outlined">settings</span>
                    Settings
                </a>
</li>
<li>
<a class="flex items-center gap-4 px-4 py-3 text-on-surface-variant dark:text-on-primary-container hover:bg-secondary-container/30 dark:hover:bg-secondary/10 transition-colors rounded-lg font-body-lg text-body-lg" href="#">
<span class="material-symbols-outlined">help_outline</span>
                    Support
                </a>
</li>
</ul>
<div class="mt-8 flex items-center gap-3 px-4">
<div class="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border border-outline-variant/30">
<img alt="User profile" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu_XnKTkMQC-NMwPK5q4oyzb9HQUhAELDa6YePCHGGOkIt4ybHDI29cZJJ7hrfYPLMt8rgtS7sJBVGdA5h4-zde6uHHCa3aFaoFbZWe94pz9bVGtov55PkrGiJX7gotxfyG82smoYP07PbXfLcDpclC0sEFqlCf0LmmC4ocacP7-FdDfHQBO1GOrAWR2j3n_YhHHUgHyGe7mf9Q_68PqBId8vQG_Uek6Jbsw491RhJbouF96N4esEEsjaAvhA3opV-nA2r82R5rqo"/>
</div>
<div class="flex-1 min-w-0">
<p class="font-body-sm text-body-sm text-primary font-medium truncate">Aura Minimalist</p>
</div>
</div>
</nav>
<!-- Main Content Wrapper -->
<div class="flex-1 md:ml-64 w-full flex flex-col min-h-screen relative pb-24 md:pb-0">
<!-- TopAppBar -->
<header class="docked full-width top-0 bg-background dark:bg-primary sticky z-30 shadow-sm md:shadow-none">
<div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
<div class="md:hidden">
<h1 class="font-display-lg text-headline-md-mobile text-primary dark:text-primary-fixed tracking-tight">Ethos Atelier</h1>
</div>
<div class="hidden md:flex flex-1 max-w-md mx-8 relative">
<span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50" style="font-size: 20px;">search</span>
<input class="w-full bg-surface-container-low border-none rounded-full py-2.5 pl-12 pr-4 text-body-sm font-body-sm focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all" placeholder="Search brands, styles, or items..." type="text"/>
</div>
<div class="flex items-center gap-4 md:gap-6 text-on-surface-variant dark:text-on-primary-container">
<button class="md:hidden hover:text-primary dark:hover:text-primary-fixed transition-colors duration-300">
<span class="material-symbols-outlined">search</span>
</button>
<button class="hover:text-primary dark:hover:text-primary-fixed transition-colors duration-300 relative">
<span class="material-symbols-outlined">shopping_bag</span>
<span class="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
</button>
<button class="hidden md:block hover:text-primary dark:hover:text-primary-fixed transition-colors duration-300">
<span class="material-symbols-outlined">chat_bubble</span>
</button>
<button class="hover:text-primary dark:hover:text-primary-fixed transition-colors duration-300">
<span class="material-symbols-outlined">notifications</span>
</button>
<div class="md:hidden w-8 h-8 rounded-full bg-surface-variant overflow-hidden border border-outline-variant/30 ml-2">
<img alt="User profile portrait" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzuIpGfhkR7Tqxb-Fia6BbLVgIPTa09vLBql6Ov8FDV5oRMNgdgZ4UnHH7aXjyE7CDbrPeqbxGnq3raJLOrXTvOeWflXNWP59ZIA9w33AzGEDVHrGAQvk6fboTqsFlYRM98wJQwugC-Wl9Vp6OKcfPBUUoDnYk5MT2qV2itRrcpHCfj9CuRf_ZTKOopn28kUebHLtnW1gKF1KjVljDOv-NnI3zT8JBZxYNyuVCs71u6i_0kx6vBk_YZpFDdUsQz8hFg1-hRCxJZLU"/>
</div>
</div>
</div>
</header>
<!-- Main Canvas -->
<main class="flex-1 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-16">
<!-- Marketplace Header -->
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
<div>
<h2 class="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">Curated Exchange</h2>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Discover pre-owned luxury and sustainable pieces from the Ethos community. Extend the lifecycle of exceptional garments.</p>
</div>
<button class="self-start md:self-auto bg-primary text-on-primary font-body-lg text-body-sm px-6 py-3 rounded-full flex items-center gap-2 hover:bg-inverse-surface hover:shadow-lg transition-all duration-300 min-h-[48px]">
<span class="material-symbols-outlined" style="font-size: 18px;">sell</span>
                    Sell an Item
                </button>
</div>
<!-- Minimal Filter Bar -->
<div class="flex items-center justify-between border-b border-outline-variant/30 pb-4 mb-8">
<div class="flex gap-6 overflow-x-auto no-scrollbar">
<button class="font-label-caps text-label-caps text-primary border-b-2 border-primary pb-4 -mb-[18px] whitespace-nowrap">All Items</button>
<button class="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors pb-4 -mb-[18px] whitespace-nowrap">Outerwear</button>
<button class="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors pb-4 -mb-[18px] whitespace-nowrap">Knitwear</button>
<button class="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors pb-4 -mb-[18px] whitespace-nowrap">Accessories</button>
</div>
<button class="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors pl-4">
<span class="material-symbols-outlined" style="font-size: 18px;">tune</span>
<span class="hidden sm:inline">Filters</span>
</button>
</div>
<!-- Product Grid (Spacious, Editorial) -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter md:gap-margin-desktop">
<!-- Product Card 1 -->
<a class="group block relative cursor-pointer" href="#">
<div class="aspect-[3/4] rounded-xl bg-surface-container-low overflow-hidden mb-4 relative transition-shadow duration-300 group-hover:shadow-[0px_10px_30px_rgba(45,45,45,0.08)]">
<img alt="A high-end editorial shot of a minimalist beige structured coat hanging against a soft white studio backdrop. The lighting is diffused and natural, highlighting the texture of the organic wool blend. The overall aesthetic is calm, luxurious, and aligns with a sustainable, timeless fashion brand's identity." class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="A high-end editorial shot of a minimalist beige structured coat hanging against a soft white studio backdrop. The lighting is diffused and natural, highlighting the texture of the organic wool blend. The overall aesthetic is calm, luxurious, and aligns with a sustainable, timeless fashion brand's identity." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0FYW6smtxDjgvmjUwqMakLGNgnkh50pSVfvNwEXWOPs_9BQuLr9UURaHp38uo_0L-RaKfBmvalwNgQO5P6wrzHgVDjvYxehj1TRdj-ch_D7xttnNNUFsYUd_Z1XrX5yLW61KKXfaJBax9NdJJWuQbIxftTmfgegPobfSesssQQaK4KYngT1jvab2U6aFSVwID4NIvXiaoiY0WLKELAzF2UX2_aPY7JRuEkXnARGaH159mJ9yXiw9kP14fWaavkQOVDlwyG4yY7iQ"/>
<!-- Condition Badge -->
<div class="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-caps text-[10px] px-2 py-1 rounded-sm tracking-wider uppercase backdrop-blur-sm bg-opacity-90">
                            Like New
                        </div>
<button class="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
<span class="material-symbols-outlined" style="font-size: 20px;">favorite</span>
</button>
</div>
<div class="flex justify-between items-start gap-2">
<div>
<p class="font-body-sm text-body-sm font-medium text-on-surface-variant mb-1">Studio Nicholson</p>
<h3 class="font-title-lg text-title-lg text-primary line-clamp-1 leading-tight mb-2">Structured Wool Coat</h3>
<p class="font-label-caps text-label-caps text-on-surface-variant/70">Size M • Organic Wool</p>
</div>
<p class="font-body-lg text-body-lg font-medium text-primary whitespace-nowrap">$450</p>
</div>
</a>
<!-- Product Card 2 -->
<a class="group block relative cursor-pointer" href="#">
<div class="aspect-[3/4] rounded-xl bg-surface-container-low overflow-hidden mb-4 relative transition-shadow duration-300 group-hover:shadow-[0px_10px_30px_rgba(45,45,45,0.08)]">
<img alt="A flat lay photograph of a finely knit, dark charcoal grey cashmere sweater folded neatly on a light grey concrete surface. Subtle morning light casts soft shadows across the garment, emphasizing its premium softness and minimalist design. The composition is clean, modern, and evocative of slow fashion principles." class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="A flat lay photograph of a finely knit, dark charcoal grey cashmere sweater folded neatly on a light grey concrete surface. Subtle morning light casts soft shadows across the garment, emphasizing its premium softness and minimalist design. The composition is clean, modern, and evocative of slow fashion principles." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQivzdnCeL4RzgHKNCYuZpbO1KWTERYbwElC40Ws_KqbZCCihBQ4dJu4NxayAt12AFunuKYEleNR3mjDQCTPFMufVAGKL5xk7qCKp3bOe9d6_6dTg3J4JG9K4LURPg0yMpFqchuQmum6bM71Jiuh8k2rzFnrJfo8qkfO5hBcdsQysk8QiBKXU_TN4CnfiLDLOSi66UMzNicuQAq4mWPy1rVyObzc1xZtYqgEPTWe7UUUv8YVMxbM82PGPjF3fiJNax5dM4M6CU9eg"/>
<!-- Condition Badge -->
<div class="absolute top-3 left-3 bg-secondary-container text-on-secondary-container font-label-caps text-[10px] px-2 py-1 rounded-sm tracking-wider uppercase backdrop-blur-sm bg-opacity-90">
                            Gently Used
                        </div>
<button class="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
<span class="material-symbols-outlined" style="font-size: 20px;">favorite</span>
</button>
</div>
<div class="flex justify-between items-start gap-2">
<div>
<p class="font-body-sm text-body-sm font-medium text-on-surface-variant mb-1">Lemaire</p>
<h3 class="font-title-lg text-title-lg text-primary line-clamp-1 leading-tight mb-2">Cashmere Blend Knit</h3>
<p class="font-label-caps text-label-caps text-on-surface-variant/70">Size L • Recycled Blend</p>
</div>
<p class="font-body-lg text-body-lg font-medium text-primary whitespace-nowrap">$280</p>
</div>
</a>
<!-- Product Card 3 -->
<a class="group block relative cursor-pointer" href="#">
<div class="aspect-[3/4] rounded-xl bg-surface-container-low overflow-hidden mb-4 relative transition-shadow duration-300 group-hover:shadow-[0px_10px_30px_rgba(45,45,45,0.08)]">
<img alt="Close-up detail shot of a pair of high-waisted, wide-leg ecru cotton trousers draped over a wooden chair. Focus is on the intricate stitching and the textured grain of the heavy cotton twill fabric. The background is a soft blur of a minimalist apartment, conveying a sense of curated, sustainable living." class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Close-up detail shot of a pair of high-waisted, wide-leg ecru cotton trousers draped over a wooden chair. Focus is on the intricate stitching and the textured grain of the heavy cotton twill fabric. The background is a soft blur of a minimalist apartment, conveying a sense of curated, sustainable living." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_mWmD2DkZj84pyivprF2beHKkkRyQw6gsSdLYLZ7i2nDJwhq_WVF1uHyDJCtgi9RB3QZZwmEG6FCcV6xM8MEsU44PJSOVGi1Aj8-nw3hZ7fpiUqKVSNDezADA3ywxAHLT5GWNYzQOqFCmx-eJneKR8pEvfktk0C1QyZNITRtRokbkY-QuAFhrnKPH05VBYm3Mpx2j2RHUKQGNckVO_2VsBfS4K8vsRtPB5oQqwDdMWja_H_o62DNjc10xksXACaqecyovVQY3Ztk"/>
<div class="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-caps text-[10px] px-2 py-1 rounded-sm tracking-wider uppercase backdrop-blur-sm bg-opacity-90">
                            Excellent
                        </div>
<button class="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
<span class="material-symbols-outlined" style="font-size: 20px;">favorite</span>
</button>
</div>
<div class="flex justify-between items-start gap-2">
<div>
<p class="font-body-sm text-body-sm font-medium text-on-surface-variant mb-1">Jil Sander</p>
<h3 class="font-title-lg text-title-lg text-primary line-clamp-1 leading-tight mb-2">Ecru Twill Trousers</h3>
<p class="font-label-caps text-label-caps text-on-surface-variant/70">Size S • Organic Cotton</p>
</div>
<p class="font-body-lg text-body-lg font-medium text-primary whitespace-nowrap">$320</p>
</div>
</a>
<!-- Product Card 4 -->
<a class="group block relative cursor-pointer" href="#">
<div class="aspect-[3/4] rounded-xl bg-surface-container-low overflow-hidden mb-4 relative transition-shadow duration-300 group-hover:shadow-[0px_10px_30px_rgba(45,45,45,0.08)]">
<img alt="A sleek, minimalist black leather crossbody bag resting on a limestone pedestal. The lighting is dramatic yet soft, highlighting the smooth texture of the vegetable-tanned leather and the subtle, matte hardware. The setting implies a gallery-like presentation of functional art pieces within a sustainable fashion context." class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="A sleek, minimalist black leather crossbody bag resting on a limestone pedestal. The lighting is dramatic yet soft, highlighting the smooth texture of the vegetable-tanned leather and the subtle, matte hardware. The setting implies a gallery-like presentation of functional art pieces within a sustainable fashion context." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEzNLPNDj1L-kD3cioSTGjfyTeh8K93-T4-u_rnTuGVa4mkQsZ2PPr0zJ_KyntYtCJuqAif35x6JUL69gMMAleI1E375gw2ZYMgUui7lnUrsbAQj07q-A5v46XP3buHyki3fMg-VDaU-xAUxZaOPvgtg3fXY5VhHPFlHnjcNpHWUapy2IummPMi9JRzpzXVYeDnmGSmeMdWOjfecau-xwATWYFyne_f9QUa5pTgMDkSs1DBzLxKvDvIwVWdhavdluCbYIc76pO16s"/>
<div class="absolute top-3 left-3 bg-secondary-container text-on-secondary-container font-label-caps text-[10px] px-2 py-1 rounded-sm tracking-wider uppercase backdrop-blur-sm bg-opacity-90">
                            Vintage
                        </div>
<button class="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
<span class="material-symbols-outlined" style="font-size: 20px;">favorite</span>
</button>
</div>
<div class="flex justify-between items-start gap-2">
<div>
<p class="font-body-sm text-body-sm font-medium text-on-surface-variant mb-1">The Row</p>
<h3 class="font-title-lg text-title-lg text-primary line-clamp-1 leading-tight mb-2">Classic Crossbody</h3>
<p class="font-label-caps text-label-caps text-on-surface-variant/70">One Size • Veg-Tanned</p>
</div>
<p class="font-body-lg text-body-lg font-medium text-primary whitespace-nowrap">$850</p>
</div>
</a>
</div>
<div class="mt-16 flex justify-center">
<button class="border border-outline text-primary font-body-sm px-8 py-3 rounded-full hover:bg-surface-variant transition-colors duration-300 min-h-[48px]">
                    Load More Pieces
                </button>
</div>
</main>
</div>
<!-- BottomNavBar (Mobile Only) -->
<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 md:hidden bg-surface-container-lowest/80 dark:bg-primary-container/80 backdrop-blur-xl border-t border-outline-variant/30 rounded-t-xl shadow-lg pb-safe">
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 dark:text-on-primary-container/60 hover:text-primary transition-colors w-16 group" href="#">
<span class="material-symbols-outlined mb-1 group-active:scale-90 transition-transform duration-200" style="font-size: 24px;">checkroom</span>
<span class="font-label-caps text-label-caps">Wardrobe</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 dark:text-on-primary-container/60 hover:text-primary transition-colors w-16 group" href="#">
<span class="material-symbols-outlined mb-1 group-active:scale-90 transition-transform duration-200" style="font-size: 24px;">auto_fix_high</span>
<span class="font-label-caps text-label-caps">Stylist</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant/60 dark:text-on-primary-container/60 hover:text-primary transition-colors w-16 group" href="#">
<span class="material-symbols-outlined mb-1 group-active:scale-90 transition-transform duration-200" style="font-size: 24px;">grid_view</span>
<span class="font-label-caps text-label-caps">Social</span>
</a>
<!-- Active Tab -->
<a class="flex flex-col items-center justify-center text-primary dark:text-primary-fixed font-bold w-16 group" href="#">
<span class="material-symbols-outlined mb-1 group-active:scale-90 transition-transform duration-200" style="font-variation-settings: 'FILL' 1; font-size: 24px;">sell</span>
<span class="font-label-caps text-label-caps">Market</span>
</a>
</nav>
<style>
        /* iOS Safe Area padding for bottom nav */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
            .pb-safe {
                padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
            }
        }
    </style>
</body></html>