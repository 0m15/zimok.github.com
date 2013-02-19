---
layout: default
title: ☁
class: home
---
{% include JB/setup %}

{% for post in site.posts %}
  {% assign page=post %}
  {% assign content=post.content %}
  {% include themes/cloudnoise/post.html %}
{% endfor %}