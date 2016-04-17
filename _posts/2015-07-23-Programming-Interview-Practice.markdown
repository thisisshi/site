---
layout: post
title:  "Preparing for Coding Interviews - Part I"
date:   2015-07-23 09:00:00
categories: interviewprep
---

Fact: I've never done an honest to God, real life, 100% legit coding interview. At least, I don't think I have. I've had the excellent (or perhaps not so excellent) ability to somehow not have to do a particularly hard technical interview... ever. So, with graduation coming in _less than a year_, I've decided to brush up on some concepts that I may or may not have forgotten.

Since teaching a subject is a great indicator that you yourself have learned the information, I've decided to devote at least some of my blog posts to working through the great books that are _Programming Interviews Exposed_ and _Cracking the Coding Interview_.

##### Part I: Linked Lists #####

Now, although I don't _plan_ on becoming a C programmer, it doesn't hurt to keep options open. One of the easiest ways to determine if someone has a real understanding of pointers in C is to ask them to describe and implement a linked list.

For those that are unfamiliar, a linked list is basically a very nice data structure that you can sort of envision as a train. On a train there are various cars, and on those cars they carry certain things -- cargo, coal, people, etc. However, to successfully understand the train's structure, all you need to know is what each car is connected to in a singular direction. The car at the front is connected to nothing (null), and each subsequent car is connected to the one that is in front of it. Now, if you were unaware of how the train looked, if you were given a description of what each car was connected to, you could easily arrange them in the correct order.

Now, what does this model imply? First, it implies that each car carries some sort of object, or data. Secondly, it implies that each car knows what car it's connected to from the front. That's the pointer. In C, we use structs to describe the node in a linked list. Thus we have the following:

{% highlight C %}
typedef struct node(){
	 	struct node *next;
	 	int data;
} node;
{% endhighlight %}

Here, we have our pointer, *next, pointing to the next node in our list. Then, we have our data which will be stored in the node.

This is what's called a Singly-Linked list. Obviously, the first improvement we can make to this is to not only store which node is in front of it, but also which node is previous to it. The main advantage to this approach is that it takes an inconsequential amount of memory to store the pointer to the previous node and also decreases the amount of time to search for the previous node significantly. Imagine if given a node you were asked to search for the node that came before it in a Singly-Linked List. How would you do it?

The answer is: [you can't](http://stackoverflow.com/questions/7198508/given-a-node-how-can-i-find-previous-node-in-a-singly-linked-list). At least, not in a way that would be nearly as efficient as just creating a Doubly-Linked list. Of course, you could try and navigate the heap and look for a node object and check to see if the `*next` pointer was equal to whatever your current memory location but let's face it, that's not an ideal solution.

As mentioned previously, a Doubly-Linked List is merely a Singly-Linked List with information about its predecessor. To accomplish this, we modify the struct to the following:

{% highlight C %}
typedef struct node(){
	struct node *next;
	struct node *prev;
	int data;
}node;
{% endhighlight %}

Now, we have both a pointer to the node that's in front and to the node that is previous to it. At this point we should ask ourselves, how do we _use_ these newly created nodes? First, let's think about what exactly these nodes are supposed to do. They're supposed to tell us what's in front of it and what came before it. If we're going to instantiate a new Linked List, we should consider what exactly should go into the first element.

If this element is the first element that is created, can it have a previous node? Can it have a successor node? Of course not. Again, imagine if you began constructing a train. The first car that you use will not be connected to anything. In the same vein, the first node will not have a `*next` or a `*prev` pointer. Instead, to indicate that this is the first item in the list, we will set `*next` to `NULL` and to indicate that this is the last item in the list, we will set `*prev` to `NULL`. Since the first car is both the first and the last part of the list, both will be null.

{% highlight C %}
bool insertInFront(node  **head, int data){
	node *newNode = malloc(sizeOf(node));
	If(!newNode){return false;}
	newNode->data = data;
	newNode->next = *head;
	*head = newNode;
	return true;
}
{% endhighlight %}

Let's go line by line. In the first line of the function, we're allocating memory for the new node by using the method `malloc` and getting the size through `sizeOf`. Next, we should check whether or not the memory was allocated correctly by checking the existence of `newNode`. Finally, we being setting the values of the node. Firstly, the data is set. This shouldn't require much additional explanation. The next line however, is a bit tricky. Many people are tempted to write the pointer as `newNode->next = head`. After all, the head variable is given to you. However, if you were to write that, the next pointer wouldn't be pointing at a location in memory at all. Instead, it would be pointing at the local head variable. Now, again, the next line could also cause people to write `head = newNode`. Instead, what should be done is `*head = newNode`. Now, we're correctly setting the pointer for head to the newNode we just created. Finally, we return true when the function completes successfully.

Now, to insert a new node, we must take into consideration the same questions as before. Where is the next node in the list? Does the next node even exist? What about the previous node?

To Be Continued.
