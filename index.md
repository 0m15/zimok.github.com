---
layout: default
title: cloudnoise
class: home
---
{% include JB/setup %}
<div class="container">
  <div role="main" class="main row"> 
    <section class="section-view" id="latest-hacks">
      <h1 class="section-title">hacks</h1>
      <ul class="list-view">
        {% for post in site.posts %}
        {% if post.categories[0] == 'hacks' %}
        <li>
          <a class="article-link cf" href="{{ post.url }}">
            <div class="article-meta threecol">
              <time datetime="{{ post.date|date_to_rfc822 }}">
                {{ post.date|date_to_string }}
              </time>
            </div>
            <div class="article-headline ninecol">
              <h2>{{ post.title }}</h2>
            </div>
          </a>
        </li>
        {% endif %}
        {% endfor %}
      </ul>
    </section>
    <section class="section-view" id="latest-posts">
      <h1 class="section-title">posts</h1>
      <ul class="list-view">
        {% for post in site.posts %}
        {% if post.categories[0] != 'hacks' %}
        <li>
          <a class="article-link cf" href="{{ post.url }}">
            <div class="article-meta threecol">
              <time datetime="{{ post.date|date_to_rfc822 }}">
                {{ post.date|date_to_string }}
              </time>
            </div>
            <div class="article-headline ninecol">
              <h2>{{ post.title }}</h2>
            </div>
          </a>
        </li>
        {% endif %}
        {% endfor %}
      </ul>
    </section>
    <aside class="section-view meta-view" role="complementary" id="about">
      <dl class="meta-descriptor cf">
        <dt class="semi-bold threecol">me</dt>
        <dd class="ninecol">front end developer, currently at <a href="http://stereomood.com">stereomood.com</a></dd>
      </dl>
      <dl class="meta-descriptor cf">
        <dt class="semi-bold threecol">contacts</dt>
        <dd class="ninecol">write me at simonecarella at gmail dot com</dd>
      </dl>
      <dl class="meta-descriptor cf">
        <dt class="semi-bold threecol">github</dt>
        <dd class="ninecol"><a href="http://github.com/zimok">github.com/zimok</a></dd>
      </dl>
      <dl class="meta-descriptor cf">
        <dt class="semi-bold threecol">twitter</dt>
        <dd class="ninecol">follow <a href="http://github.com/zimok">@zimok</a></dd>
      </dl>
    </aside>
    <footer class="">
      <p>
        <small>&copy; 2013 &ndash; simone carella</small>
      </p>
    </footer>
  </div>
</div>