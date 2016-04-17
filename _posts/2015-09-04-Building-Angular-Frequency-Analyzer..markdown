---
layout: post
title:  "Dev Blog: Building the Angular Frequency Analyzer"
date:   2015-09-04 09:00:00
categories: angular
---

Out of all the classes that I'm taking right now in my penultimate (!!) semester at OSU, the most interesting one is probably _Linguistics 3801: Codes and Code Breaking_. Not only was I pretty enthralled with the 2014 Academy Award Winning Film _The Imitation Game_, I've always been at least generally interested in codes and code breaking, mostly from a _"Hm, that's pretty cool, I woudn't have thought to do it that way"_ sort of way.

To assist with breaking some of the ciphers in the class and in an effort to _finally_ start learning AngularJS, I decided that I would build a tool to help assist me with some of this code breaking. Currently, the name of the application is called the "Angular Frequency Analyzer" which will no doubt change as the class progresses and I realize that I need to use additional tools other than frequency analysis.

The first cipher we encountered was the Caesar shift, which while incredibly easy to crack, my application (in its current form) doesn't quite support yet.

_Note: It is indeed possible to crack a Caesar shift with frequency analysis, but the amount of work involved in doing so would be a lot less efficient than even hand writing out each shift_

This application is best suited for cracking general monoalphabetic ciphers by hand with the applicationi assisting in some of the grunt work of counting all the instances of each letter and turning them into more user friendly percentages. Included in the application is a table of the frequency of English letters from <a href="http://www.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html">the Math Explorers Club of Cornell University</a>.

#### Buliding the Application ####

Previously, I had basically no experience in AngularJS other than the brief tutorial (that I'm pretty sure I didn't even finish) from their website. AngularJS is yet another MVC Javascript framework, this time coming from Google.

What I knew that I wanted from the application was at least:

1. The ability to dynamically analyze encrypted text in terms of character frequency
2. To display the results in a graphically pleasing manner

To satisfy the first one, I just had to do some string manipulation and analysis. A call to the function `{{calcInstances()}}` takes in the current input that the user has provided and begins to calculate the frequency of each character in the string. At first, I approached this by writing a huge switch case statement which technically would do the trick but at the cost of having a huge block of code that could be more efficiently written.

```javascript
	for (var i = 0; i < $scope.cryptInput.length; i++) {
				switch($scope.cryptInput[i]){
					case "a":
					$scope.hash.a = $scope.hash.a + 1
					break;
					case "b":
					$scope.hash.b = $scope.hash.b + 1
					break;
					case "c":
					$scope.hash.c = $scope.hash.c + 1
					break;
					case "d":
					$scope.hash.d = $scope.hash.d + 1
					break;
					case "e":
					$scope.hash.e = $scope.hash.e + 1
					break;
					case "f":
					$scope.hash.f = $scope.hash.f + 1
					break;
					case "g":
					$scope.hash.g = $scope.hash.g + 1
					break;
					case "h":
					$scope.hash.h = $scope.hash.h + 1
					break;
					case "i":
					$scope.hash.i = $scope.hash.i + 1
					break;
					case "j":
					$scope.hash.j = $scope.hash.j + 1
					break;
					...
```

Yuck. And that's just the for loop. Instead, apparently you can do this magical thing in Javascript to access properties in objects through strings like so: `$scope.hash[cryptInput[i]]` where hash is an object with a property that has the name stored in variable `cryptInput[i]`.


```javascript
	$scope.calcInstances = function(){
		$scope.cryptInput = angular.uppercase($scope.cryptInput);
		$scope.hash = angular.copy($scope.hashmaster);
		$scope.percent = angular.copy($scope.hashmaster);
		$scope.max = angular.copy($scope.maxmaster)
		// Gets the Instances of each character
		for (var i = 0; i < $scope.cryptInput.length; i++) {
			$scope.hash[$scope.cryptInput[i]]++;
			$scope.percent[$scope.cryptInput[i]] =  ($scope.hash[$scope.cryptInput[i]] / $scope.cryptInput.length)*100;
			if ($scope.max.value < $scope.hash[$scope.cryptInput[i]]){
				$scope.max.character = $scope.cryptInput[i];
				$scope.max.value = $scope.hash[$scope.cryptInput[i]]
			}
		};
	};
```

Much better.

As you can see, not only am I able to tally up the number of instances of each letter in the encrypted text, I'm also able to determine the character with the most instances _and_ to calculate the percentage frequency of each character in one fell swoop. The rest of the application is mostly front end fiddling with Bootstrap and the use of a very nice table sort javascript library created by tristan which can be seen <a href="https://github.com/tristen/tablesort">here.</a>
