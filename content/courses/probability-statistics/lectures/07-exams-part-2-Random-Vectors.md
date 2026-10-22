---
type: exam
title: "Exams Part 2: Random Vectors"
description: "Exam problems on random vectors: joint, marginal, and conditional distributions, covariance, and independence."
tags: ["random vectors", "joint distribution", "marginal distribution", "covariance", "exam problems"]
order: 7
---

## Random Vectors

### Task [11.2025]

You are on the ground floor of a building with four more floors. Dr. House's office is not on the ground floor but on one of those four floors.

You take the elevator and randomly choose a floor to check. If the office is not there, you again choose randomly among the remaining unvisited floors and continue until you find it.

In the end, you learn that the office is on the third floor. Let $X$ be the number of floors visited until the office is found, and let $Y=1$ if the fourth floor was visited and $0$ otherwise.

- Determine the probability distribution of $(X,Y)$.

- Determine the marginal distributions of $X$ and $Y$.

- Calculate $P\{X\le2\mid Y=1\}$.

- Are $X$ and $Y$ independent?

### Task [11.2025]

You are on the ground floor of a building with five more floors. Dr. House's office is not on the ground floor but on one of those five floors.

You take the elevator and randomly choose a floor to check. If the office is not there, you again choose randomly among the remaining unvisited floors and continue until you find it.

In the end, you learn that the office is on the fourth floor. Let $X$ be the number of floors visited until the office is found, and let $Y=1$ if the first floor was visited and $0$ otherwise.

- Determine the probability distribution of $(X,Y)$.

- Determine the marginal distributions of $X$ and $Y$.

- Calculate $P\{X\ge2\mid Y=0\}$.

- Are $X$ and $Y$ independent?

### Task [11.2025]

A box contains $4$ slips labeled $3$ and $3$ slips labeled $4$. Two slips are drawn simultaneously. If the numbers are equal, a die is rolled $3$ times; otherwise, it is rolled $2$ times. Let $Y$ be the number of rolls and $X$ the number of rolls showing a number less than $5$.

- (10) Determine the probability distribution of $(X,Y)$.

- (2) Determine the marginal distribution of $X$.

- (3) Determine the conditional distribution of $X\mid\{Y=2\}$.

### Task [11.2025]

A box contains $5$ slips labeled $1$ and $3$ slips labeled $2$. Two slips are drawn simultaneously. If the numbers are equal, a die is rolled $2$ times; otherwise, it is rolled $3$ times. Let $X$ be the number of rolls and $Y$ the number of rolls showing an even number.

- (10) Determine the probability distribution of $(X,Y)$.

- (2) Determine the marginal distribution of $Y$.

- (3) Determine the conditional distribution of $X\mid\{Y=1\}$.

### Task: Chocolates 1 [11.2024]

A store sells three types of chocolates in packages of $5$, and every combination of types is equally likely.

Nino buys one package. From each type present, he eats either one chocolate or none. For example, if the package contains $2$ chocolates of the first type and $3$ of the second, he may eat none, one of the first type, one of the second type, or two (one of each type).

He eats exactly one chocolate with probability $0.75$. Let $X$ be the number of chocolate types in the package and $Y$ the number of chocolates Nino eats.

- (3+3) How many different packages are possible? How many contain at least one chocolate of each type?

- (5+10) Determine the probability distribution of $X$ and the joint distribution of $(X,Y)$.

- (5) Determine the distribution of $X$, given that Nino ate no chocolates.

### Task: Chocolates 2 [11.2024]

A store sells three types of chocolates in packages of $5$, and every combination of types is equally likely.

Nino buys one package. From each type present, he eats either one chocolate or none. For example, if the package contains $2$ chocolates of the first type and $3$ of the second, he may eat none, one of the first type, one of the second type, or two (one of each type).

He eats exactly one chocolate with probability $0.6$. Let $X$ be the number of chocolate types in the package and $Y$ the number of chocolates Nino eats.

- (3+3) How many different packages are possible? How many contain at least one chocolate of each type?

- (5+10) Determine the probability distribution of $X$ and the joint distribution of $(X,Y)$.

- (5) Determine the distribution of $X$, given that Nino ate exactly one chocolate.

### Task: Interview [06.2025]

A candidate has three interviews in succession, each of which can be successful or unsuccessful. Each interview is successful with probability $1/3$, independently of the others. Let $X$ be the number of successful interviews among the first two, and $Y$ the total number of successful interviews.

- (8) Determine the joint distribution of $(X,Y)$.

- (2) Determine the marginal distribution of $X$.

- (1) Are $X$ and $Y$ independent?

- (2) Determine the correlation coefficient of $X$ and $Y$.

### Task: Interview [06.2025]

A candidate has three interviews in succession, each of which can be successful or unsuccessful. Each interview is successful with probability $1/4$, independently of the others. Let $X$ be the number of successful interviews among the first two, and $Y$ the total number of unsuccessful interviews.

- (8) Determine the joint distribution of $(X,Y)$.

- (2) Determine the marginal distribution of $X$.

- (1) Are $X$ and $Y$ independent?

- (2) Determine the correlation coefficient of $X$ and $Y$.

### Task: Call center [01.2025]

A call center has $5$ employees, two experienced and three inexperienced. For a given call, two employees are selected at random.

If two experienced employees answer, the customer's requirements are met with probability $0.95$; if two inexperienced employees answer, with probability $0.60$; and if one of each answers, with probability $0.75$.

Let $X$ be the number of selected experienced employees and $Y$ the indicator that the customer's requirements are met.

- Determine the joint distribution of $(X,Y)$.

- Determine the marginal distribution of $Y$.

- Are $X$ and $Y$ independent?

- Determine $\operatorname{cov}(X,Y)$.

### Task: Urgency center [01.2025]

An emergency center has $5$ doctors, two more experienced and three less experienced. For a given patient, two doctors are selected at random.

If two more experienced doctors examine the patient, appropriate therapy is given with probability $0.90$; if two less experienced doctors examine the patient, with probability $0.75$; and if one of each examines the patient, with probability $0.85$.

Let $X$ be the number of selected more experienced doctors and $Y$ the indicator that the patient receives appropriate therapy.

- Determine the joint distribution of $(X,Y)$.

- Determine the marginal distribution of $Y$.

- Are $X$ and $Y$ independent?

- Determine $\operatorname{cov}(X,Y)$.

### Task: Drunk man [02.2024]

A drunk man wanders at random in a large open space. At each step, he moves one unit north, south, east, or west with equal probabilities (he does not stay in place). His initial position is $(0,0)$. Let $X_1$ be the $x$-coordinate after the first step and $X_2$ the $x$-coordinate after the second step. Determine:

- (9) The joint distribution of $(X_1,X_2)$.

- (4) The covariance of $(X_1,X_2)$.

- (3) The distribution of $Z=X_1+X_2$.

### Task: Drunk man [02.2024]

A drunk man wanders at random in a large open space. At each step, he moves one unit north, south, east, or west with equal probabilities (he does not stay in place). His initial position is $(1,1)$. Let $Y_1$ be the $y$-coordinate after the first step and $Y_2$ the $y$-coordinate after the second step. Determine:

- (9) The joint distribution of $(Y_1,Y_2)$.

- (4) The covariance of $(Y_1,Y_2)$.

- (3) The distribution of $Z=Y_1+Y_2$.

### Task: Coin toss [09.2024]

(6+6+2+2) A fair coin is tossed three times. Let $X$ be the number of tails in the first two tosses and $Y$ the total number of heads.

- (6) Determine the joint distribution of $(X,Y)$.

- (4) Determine the marginal distributions of $X$ and $Y$.

- (3) Determine the conditional distribution of $Y$ given $\{X=1\}$.

- (2) Determine the expected value and variance of $Y$.

- (1) Are $X$ and $Y$ independent?

### Task: Coin toss [09.2024]

(6+6+2+2) A fair coin is tossed three times. Let $X$ be the number of tails in the first two tosses and $Y$ the total number of heads.

- (6) Determine the joint distribution of $(X,Y)$.

- (4) Determine the marginal distributions of $X$ and $Y$.

- (3) Determine the conditional distribution of $Y$ given $\{Y=2\}$.

- (2) Determine the expected value and variance of $X$.

- (1) Are $X$ and $Y$ independent?

### Task: Balls [06.2024]

A box contains $5$ balls labeled $1$ through $5$. Two balls are drawn at random simultaneously and returned to the box. The experiment is repeated twice. Let $X$ be the number of drawn balls labeled $1$, and $Y$ the number labeled $2$.

- Determine the distribution of $(X,Y)$.

- Determine the marginal distribution of $X$.

- Determine $P\{X+Y\le2\}$.

- Determine $P\{X\le2\mid Y\ge1\}$.

### Task: Balls [06.2024]

A box contains $4$ balls labeled $1$ through $4$. Two balls are drawn at random simultaneously and returned to the box. The experiment is repeated twice. Let $X$ be the number of drawn balls labeled $1$, and $Y$ the number labeled $2$.

- Determine the distribution of $(X,Y)$.

- Determine the marginal distribution of $X$.

- Determine $P\{X+Y\le2\}$.

- Determine $P\{X\le2\mid Y\ge1\}$.

### Task [11.2023]

A box contains four balls labeled $0$, $1$, $2$, and $3$. Balls are drawn one by one without replacement until the sum of the drawn numbers is even. If an even number is drawn first, the drawing ends immediately. Let $X$ be the number of draws and $Y$ the sum of the drawn numbers when the drawing ends.

- (9) Determine the distribution of $(X,Y)$.

- (2) Determine the marginal distribution of $X$.

- (2) Calculate $P\{X\le3\mid Y<3\}$.

- (2) Calculate $F(2.5,3.7)$.

### Task [11.2023]

A box contains four balls labeled $0$, $3$, $4$, and $5$. Balls are drawn one by one without replacement until the sum of the drawn numbers is odd. If an odd number is drawn first, the drawing ends immediately. Let $X$ be the sum of the drawn numbers when the drawing ends and $Y$ the number of draws.

- (9) Determine the distribution of $(X,Y)$.

- (2) Determine the marginal distribution of $X$.

- (2) Calculate $P\{X>5\mid Y<3\}$.

- (2) Calculate $F(4.2,2.5)$.

### Task: Data Scientist [06.2023]

Imagine you are a data scientist at a company that analyzes customer behavior. Each customer places orders on a website until they complain and return an order, or until they have placed $3$ orders.

A customer complains and returns an order with probability $1/5$ per purchase. After each order, they may write at most one comment about the purchased product, with probability $1/4$. Each comment is written independently of previous comments and of the orders.

Let $X$ be the number of orders placed and $Y$ the number of comments written.

- (10) Determine the distribution of $(X,Y)$. Explain in detail how $P\{X=2,Y=1\}$ is obtained.

- (2) Determine the marginal distribution of $Y$.

- (3) Determine $P\{X\ge2\mid Y<2\}$.

### Task: Data Scientist [06.2023]

Imagine you are a data scientist at a company that analyzes customer behavior. Each customer places orders on a website until they complain and return an order, or until they have placed $3$ orders.

A customer complains and returns an order with probability $1/4$ per purchase. After each order, they may write at most one comment about the purchased product, with probability $1/3$. Each comment is written independently of previous comments and of the orders.

Let $X$ be the number of orders placed and $Y$ the number of comments written.

- (10) Determine the distribution of $(X,Y)$. Explain in detail how $P\{X=2,Y=1\}$ is obtained.

- (2) Determine the marginal distribution of $X$.

- (3) Determine $P\{Y\ge2\mid X<3\}$.

### Task: Balls [08.2023]

(9+3+4) A box contains $3$ white and $7$ black balls. Three balls are drawn without replacement. Let $X$ be the number of white balls drawn and $Y$ the number of black balls drawn.

- Determine the distribution of $(X,Y)$.

- Calculate $P\{X\le Y\}$.

- Calculate $E(XY)$.

### Task: Balls [08.2023]

(9+3+4) A box contains $4$ white and $6$ black balls. Three balls are drawn without replacement. Let $X$ be the number of white balls drawn and $Y$ the number of black balls drawn.

- Determine the distribution of $(X,Y)$.

- Calculate $P\{X\ge Y\}$.

- Calculate $E(XY)$.

### Task: Coins [11.2022]

A coin is tossed three times. If all three tosses show the same side, the coin is tossed once more. Define:

- $X$: the number of tails;

- $Y$: the number of tosses.

Determine:

- (9) The distribution of $(X,Y)$. For several probabilities, explain in detail how they were obtained.

- (2) The marginal distributions of $X$ and $Y$.

- (2) Are $X$ and $Y$ independent?

### Task: Coins [11.2022]

A coin is tossed three times. If the three tosses are not all the same side, the coin is tossed once more. Define:

- $X$: the number of tails;

- $Y$: the number of tosses.

Determine:

- (9) The distribution of $(X,Y)$. For several probabilities, explain in detail how they were obtained.

- (2) The marginal distributions of $X$ and $Y$.

- (2) Are $X$ and $Y$ independent?

### Task: Balls [08.2022]

In each of four boxes there are $3$ white and $2$ black balls. One ball is drawn from the first box. If it is white, the experiment ends. If it is black, one ball is drawn from the second box, and so on. After drawing from the fourth box, the experiment definitely ends. Let $X$ be the number of boxes from which a ball was drawn and $Y$ the number of white balls drawn.

- (12) Determine the distribution of $(X,Y)$.

- (2+2) Determine the marginal distributions of $X$ and $Y$.

- (2+2) Determine the expected value and variance of $Y$.

- (3) Determine $P\{2\le X<4,\ 1\le Y\le2\}$.

- (2) Are $X$ and $Y$ independent?

### Task: Balls [08.2022]

In each of four boxes there are $3$ white and $4$ black balls. One ball is drawn from the first box. If it is black, the experiment ends. If it is white, one ball is drawn from the second box, and so on. After drawing from the fourth box, the experiment definitely ends. Let $X$ be the number of boxes from which a ball was drawn and $Y$ the number of black balls drawn.

- (12) Determine the distribution of $(X,Y)$.

- (2+2) Determine the marginal distributions of $X$ and $Y$.

- (2+2) Determine the expected value and variance of $Y$.

- (3) Determine $P\{2\le X<4,\ 1\le Y\le2\}$.

- (2) Are $X$ and $Y$ independent?

### Task: Balls [02.2022]

In a game, a player first draws one ball from a box containing equal numbers of balls labeled with even and odd numbers. If the ball is even, the player shoots twice; if it is odd, once. Each shot hits with probability $1/4$. Each hit earns $2$ points, while a miss earns none. Let $X$ be the number of shots and $Y$ the points earned.

- (12) Determine the distribution of $(X,Y)$. Explain in detail how $P\{X=2,Y=2\}$ is obtained.

- (4) Determine the marginal distribution of $Y$.

- (4) Determine $F(1.75,2.25)$, where $F$ is the joint cumulative distribution function of $(X,Y)$.

- (5) Determine $P\{X>1\mid Y\le2\}$.

### Task: Balls [02.2022]

In a game, a player first draws one ball from a box containing equal numbers of balls labeled with even and odd numbers. If the ball is even, the player shoots twice; if it is odd, once. Each shot hits with probability $1/3$. Each hit earns $3$ points, while a miss earns none. Let $X$ be the number of shots and $Y$ the points earned.

- (12) Determine the distribution of $(X,Y)$. Explain in detail how $P\{X=2,Y=3\}$ is obtained.

- (4) Determine the marginal distribution of $Y$.

- (4) Determine $F(1.75,2.25)$, where $F$ is the joint cumulative distribution function of $(X,Y)$.

- (5) Determine $P\{X>1\mid Y\le3\}$.

### Task: Coordinates [06.2022]

A particle moves in the plane starting from $(2,1)$. At each step it moves one unit left with probability $1/4$, one unit up with probability $1/3$, or stays in place with probability $5/12$. Movements are independent, and staying counts as a movement. Let $X$ be the number of left moves after two movements and $Y$ the $x$-coordinate after two movements. Determine:

- (10) The distribution of $(X,Y)$. Explain how $P\{X=2,Y=1\}$ is obtained.

- (5) The marginal distribution of $Y$.

- (5) $P\{X\le1\mid Y<2\}$.

- (5) The distribution of $Z=X+Y$.

### Task: Coordinates [06.2022]

A particle moves in the plane starting from $(3,1)$. At each step it moves one unit left with probability $1/3$, one unit up with probability $1/4$, or stays in place with probability $5/12$. Movements are independent, and staying counts as a movement. Let $X$ be the number of left moves after two movements and $Y$ the $x$-coordinate after two movements. Determine:

- (10) The distribution of $(X,Y)$. Explain how $P\{X=2,Y=2\}$ is obtained.

- (5) The marginal distribution of $Y$.

- (5) $P\{X\le1\mid Y<3\}$.

- (5) The distribution of $Z=X+Y$.

### Task: Coordinates [08.2021]

A particle moves in the plane starting from $(1,1)$. At each step it moves one unit right with probability $1/3$, one unit down with probability $1/2$, or stays in place with probability $1/6$. Movements are independent, and staying counts as a movement. Let $(X,Y)$ be the position after two movements. Determine:

- (10) The distribution of $(X,Y)$.

- (5) The conditional distribution of $Y$ given $\{X\le2\}$.

- (3) The covariance of $X$ and $Y$.

- (7) The distribution of $Z=X+Y$.

### Task [11.2020]

A box contains $5$ slips labeled $1$ and $3$ slips labeled $3$. Slips are drawn without replacement until the sum of the drawn numbers exceeds $4$. Let $X$ be the number of draws and $Y$ the sum of the drawn numbers.

- (15) Determine the distribution of $(X,Y)$.

- (5) Determine the conditional distribution of $X\mid\{Y=5\}$.

- (7) Determine $P\{X\ge3\mid Y<7\}$.

- (3) Are $X$ and $Y$ independent?

- (5) Determine $F(3.7,4.5)$, where $F$ is the joint cumulative distribution function of $(X,Y)$.

### Task [11.2021]

In a game, a player draws two cards simultaneously from a box containing $4$ red and $6$ green cards. Depending on their colors:

- if the cards have different colors, the player rolls a die once;

- if they have the same color, the player rolls a die twice.

Let $X$ be the number of rolls and $Y$ the number of rolls showing a number divisible by $3$.

- (15) Determine the distribution of $(X,Y)$. Explain in detail how $P\{X=2,Y=1\}$ is obtained.

- (5) Determine the marginal distribution of $Y$.

- (5) Determine $F(2.1,0.5)$, where $F$ is the joint cumulative distribution function of $(X,Y)$.

- (7) Determine $P\{X\ge1\mid Y<2\}$.

- (3) Are $X$ and $Y$ independent?

### Task [02.2021]

At a competition, an archer draws two balls simultaneously from a box containing $2$ balls marked $0$ and $3$ balls marked $1$. The archer then shoots as many times as the sum of the drawn numbers. Each shot hits with probability $1/4$. Let $X$ be the number of shots and $Y$ the number of hits.

- (12) Determine the distribution of $(X,Y)$. Explain how $P\{X=2,Y=1\}$ is obtained.

- (4) Determine the marginal distribution of $X$.

- (4) Determine $P\{X\ge1\mid Y<2\}$.

- (5) Determine $E(Y\mid X=2)$.

### Task [06.2021]

A gambler has $4$ packs of cards, each containing equal numbers of red, blue, and green cards. At the start of the game, he pays $2$ dollars, then draws one card from each pack. He wins $3$ dollars for $2$ red cards, $5$ dollars for $3$ red cards, and $10$ dollars for $4$ red cards. Let $X$ be the gambler's profit and $Y$ the number of blue cards drawn.

- (12) Determine the distribution of $(X,Y)$.

- (5) Are $X$ and $Y$ independent?

- (5) What is the probability that the gambler has a positive profit given that he drew more than one blue card?

- (5) What is the expected profit?
