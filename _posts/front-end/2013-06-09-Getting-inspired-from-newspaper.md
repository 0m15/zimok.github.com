---
layout: post
title: Semantic UI 
categories: [front end, css3, semantic]
post_image:
class: post
---

Naming css class it's hard, because it's hard to find names which have both a semantic sense and a descriptive meaning.

I experienced this problem recently, while I was writing a new project's stylesheet from scratch. I was feeling very frustrated in figuring out proper names to give at elements (I'm a little bit paranoid about this, because what I want I always try to accomplish is to produce reusable code).

I want to share a source which helped me a lot: **newspaper glossary**.

I picked the [first available one] and launched Sublime Text.

I simply namespaced classes with `ui-` prefix, to avoid any conflict for such generic terms. I ended up with a modular, reusable, extendible css structure.

Moreover, I think it's really **semantic**. I mean, there are no `bold`, `light` or `bigger` like class names. Everything makes more sense and doesn't express any decorative intents.

Here is an excerpt for what regards typographic elements:

    /* the main title of a story, page, section */
    .ui-headline {}

    /* like a subtitle */
    .ui-deck,
    .ui-subhead {}

    /* introductory headline */
    .ui-overline {}

    /* heading set in the body in order to break it into sections */
    .ui-head {}

    /* author name at beginning of a story */
    .ui-byline {}

    /* the main text of a story */
    .ui-copy {}

    /* an identification (title) for an illustration, picture, media etc */.
    .ui-caption {}

    /* an explanatory label */
    .ui-callout {}

    /* a quote */
    .ui-quote {}

    ...


[first available one]: http://www.thenewsmanual.net/Resources/glossary.html