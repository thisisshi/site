---
layout: post
title:  "Preparing for Coding Interviews - Part I"
date:   2015-07-23 09:00:00
categories: interviewprep
---

Fact: I've never done an hones to God, real life, 100% legit coding interview. At least, I don't think I have. I've had the excellent (or perhaps not so excellent) ability to somehow not have to do a particularly hard technical interview. So, with graduation coming in _less than a year_, I've decided to brush up on some concepts that I may or may not have forgotten.

Since teaching a subject is a great indicator that you yourself have learned the information, I've decided to devote at least some of my blog posts to working through the great books that are _Programming Interviews Exposed_ and _Cracking the Coding Interview_.

#####Part I: Linked Lists#####

Now, although I don't _plan_ on becoming a C programmer, it doesn't hurt to keep options open. One of the easiest ways to determine if someone has a real understanding of pointers in C is to ask them to describe and implement a linked list.

For those that are unfamiliar, a linked list is basically a very nice data structure that you can sort of envision as a train. On a train there are various cars, and on those cars they carry certain things -- cargo, coal, people, etc. However, to successfully understand the train's structure, all you need to know is what each car is connected to in a singular direction. The car at the front is connected to nothing (null), and each subsequent car is connected to the one that is infront of it. Now, if you were unaware of how the train looked, if you were given a description of what each car was connected to, you could easily arrange them in the correct order.

Now, what does this model imply? First, it implies that each car carries some sort of object, or data. Secondly, it implies that each car knows what car it's connected to from the front. That's the pointer. In C, we use structs to describe the node in a linked list. Thus we have the following:

{% highlight C %}
typedef struct node(){
	 	struct node* next;
	 	int data;
} node;
{% endhighlight %}