---
type: exam
title: "Exams Part 1: Total Probability and Bayes' Theorem"
description: "Exam problems on total probability and Bayes' theorem, covering conditional probability, partitions, and diagnostic tests."
tags: ["total probability", "Bayes' theorem", "conditional probability", "exam problems"]
order: 6
---

## Total Probability and Bayes' Theorem

### Task: Dice [11.2025]

Die A has $3$ red and $4$ blue faces, and die B has $3$ red and $2$ blue faces. A coin is tossed: if it lands heads, die B is rolled; if tails, die A is rolled.

- (6) Find the probability that the rolled die shows blue.

- (8) The experiment is repeated $n$ times. If blue appeared $n$ times in the $n$ rolls, find the probability that die A was rolled at least once.

### Task: Frogs [11.2025]

A researcher observes a colony of $6$ rare frogs. During the night, each frog croaks with probability $0.7$ or stays silent, independently of the others.

The next morning, the researcher checks whether a predator bird that reacts to the frogs' sounds has appeared. The probability of the bird appearing is proportional to the number of frogs that croaked. More precisely, if $k$ frogs croaked, this probability is $k/(1+2+\dots+6)=k/21$.

### Task: System checks 1 [06.2025]

In a system, $3$ checks of user activity are made each day. In each check, unusual behavior is detected with probability $0.3$, independently of the other checks.

If exactly $2$ checks detect unusual behavior, the user is blocked with probability $0.5$; if exactly $3$ checks detect it, the user is blocked with probability $0.8$. If only one check or none detects unusual behavior, the user is not blocked.

- (6) Determine the probability that the user is blocked.

- (2) If the user was not blocked, determine the probability that exactly $2$ checks detected unusual behavior.

### Task: System checks 2 [06.2025]

In a system, $4$ checks of user activity are made each day. In each check, unusual behavior is detected with probability $0.3$, independently of the other checks.

If exactly $3$ checks detect unusual behavior, the user is blocked with probability $0.6$; if exactly $4$ checks detect it, the user is blocked with probability $0.9$. If fewer than three checks detect unusual behavior, the user is not blocked.

- (6) Determine the probability that the user is blocked.

- (2) If the user was not blocked, determine the probability that exactly $3$ checks detected unusual behavior.

### Task: Support call center 1 [2.2025]

Calls arrive at a support center at an average rate of $3$ per hour. Assume the number of calls in one hour is Poisson, $P(3)$. To improve service, the center uses the following policy:

- If at most $2$ calls arrive in an hour, no alarm is declared.

- If $3$ or $4$ calls arrive, an alarm is declared when at least $2$ of them contain a complaint.

- If at least $5$ calls arrive, an alarm is declared.

A call contains a complaint with probability $0.05$, independently of other calls.

- What is the probability that the center declares an alarm?

- If the center declared an alarm, what is the probability that exactly $4$ calls arrived in one hour?

### Task: Emergency center [2.2025]

Patients arrive at an emergency center at an average rate of $4$ per hour. Assume the number of arrivals in one hour is Poisson, $P(4)$. The center uses the following policy:

- If at most $3$ patients arrive in an hour, no alarm is declared.

- If $4$ or $5$ patients arrive, an alarm is declared when at least $3$ of them are in critical condition.

- If at least $6$ patients arrive, an alarm is declared.

A patient is in critical condition with probability $0.10$, independently of the others.

- What is the probability that the center declares an alarm?

- If the center declared an alarm, what is the probability that exactly $5$ patients arrived in one hour?

### Task: Shooting at a target [11.2024]

Alan and Boris shoot at a target in turn, starting with Alan. The first to hit the target three times wins. Let $A$ be the event that Alan wins. Explain whether each choice of hypotheses can be used in

$$
P(A)=\sum_i P(H_i)P(A\mid H_i).
$$

- $H_i$: Alan hits on the $i$-th shot.

- $H_i$: Boris has shot $i$ times.

### Task: Game [11.06.2024]

Petar, Martin, and Lena play a game with $2$ red, $2$ blue, $2$ green, and $4$ white shells. Multiple winners are possible. Without looking, each picks one shell at random (they choose simultaneously).

- If the chosen shells include at least one red, Petar wins.

- If they include at least one blue, Martin wins.

- If they include at least one green, Lena wins.

Determine:

- What is the probability that at least one of the three does not win?

- Vlado is angry because they are playing in his yard. He rolls a fair die:
  - If it lands on $1$, he kicks out Petar.
  - If it lands on $2$, he kicks out Martin.
  - If it lands on $3$, he kicks out Lena.
  - If it lands on $4$, he randomly chooses two of them to kick out.
  - If it lands on $5$ or $6$, he kicks out all three.

After part (a), the friends return the shells, but Martin eats one shell and it is unknown which. After this change, all three repeat the game, and Vlado then kicks out at least one of them according to the rule above. What is the probability that Martin wins but is still kicked out of the yard?

### Task: Game [11.06.2024]

Petar, Martin, and Lena play a game with $3$ red, $2$ blue, $3$ green, and $3$ white shells. Multiple winners are possible. Without looking, each picks one shell at random (they choose simultaneously).

- If the chosen shells include at least one red, Petar wins.

- If they include at least one blue, Martin wins.

- If they include at least one green, Lena wins.

Determine:

- What is the probability that at least one of the three does not win?

- Vlado is angry because they are playing in his yard. He rolls a fair die:
  - If it lands on $1$, he kicks out Petar.
  - If it lands on $2$, he kicks out Martin.
  - If it lands on $3$, he kicks out Lena.
  - If it lands on $4$, he randomly chooses two of them to kick out.
  - If it lands on $5$ or $6$, he kicks out all three.

After part (a), the friends return the shells, but Martin eats one shell and it is unknown which. After this change, all three repeat the game, and Vlado then kicks out at least one of them according to the rule above. What is the probability that Martin wins but is still kicked out of the yard?

### Task: Housing loan [09.2024]

An insurance company insures $4000$ doctors, $8000$ teachers, and $12000$ businesspeople. The probabilities that a doctor, teacher, or businessperson files a claim for a serious injury are $0.01$, $0.03$, and $0.02$, respectively.

- Determine the probability that a randomly selected insured person files a claim for a serious injury.

- If an insured person filed such a claim, determine the probability that they are a teacher.

### Task: Housing loan [09.2024]

A bank has accounts held by $3000$ doctors, $6000$ teachers, and $9000$ businesspeople. The probabilities that a doctor, teacher, or businessperson requests a housing loan are $0.3$, $0.4$, and $0.2$, respectively.

- (7) Determine the probability that a randomly selected client requests a housing loan.

- (5) If a client requested a housing loan, determine the probability that they are a businessperson.

### Task: Course 1 [11.2023]

$45\%$ of FINKI students regularly attend both lectures and exercises for Probability and Statistics, while $15\%$ attend irregularly. The remaining students do not take the course.

The probability that a FINKI student is involved in machine learning, given that they took the course regularly, is twice the corresponding probability for irregular attendance and four times the corresponding probability for students who did not take the course.

If a randomly selected FINKI student is involved in machine learning, what is the probability that they took the course regularly?

### Task: Course 1 [11.2023]

$45\%$ of FINKI students regularly attend both lectures and exercises for Advanced Algorithms, while $10\%$ attend irregularly. The remaining students do not take the course.

The probability that a FINKI student is a well-paid programmer, given that they took the course regularly, is twice the corresponding probability for irregular attendance and three times the corresponding probability for students who did not take the course.

If a randomly selected FINKI student is a well-paid programmer, what is the probability that they took the course regularly?

### Task: Box with balls [08.2023]

(9+3) One box contains $5$ white, $3$ red, and $2$ green balls; another contains $2$ white, $4$ red, and $3$ green balls. One ball is drawn from the first box and transferred to the second. Then $3$ balls are drawn from the second box. If the three drawn balls have different colors, what is the probability that the transferred ball was:

- red?

- not red?

### Task: Box with balls [08.2023]

(9+3) One box contains $3$ white, $2$ red, and $5$ green balls; another contains $3$ white, $2$ red, and $4$ green balls. One ball is drawn from the first box and transferred to the second. Then $3$ balls are drawn from the second box. If the three drawn balls have different colors, what is the probability that the transferred ball was:

- white?

- not white?

### Task: Airplane 1 [11.2022]

Five projectiles are fired at an airplane. Each hits independently with probability $0.2$. To shoot the airplane down, at least $3$ hits are required. If $3$ projectiles hit, it is shot down with probability $0.5$; if $4$ hit, with probability $0.7$; and if all $5$ hit, it is certainly shot down.

- Determine the probability that the airplane is shot down.

- If the airplane was shot down, what is the probability that it was hit by $4$ projectiles?

### Task: Airplane 2 [11.2022]

Six projectiles are fired at an airplane. Each hits independently with probability $0.3$. To shoot the airplane down, at least $4$ hits are required. If $4$ projectiles hit, it is shot down with probability $0.3$; if $5$ hit, with probability $0.6$; and if all $6$ hit, it is certainly shot down.

- Determine the probability that the airplane is shot down.

- If the airplane was shot down, what is the probability that it was hit by $5$ projectiles?

### Task: Set of numbers [08.2022]

From $\{1,2,3,4,5\}$, one number is drawn at random, and then another is drawn without replacement.

- (7) Determine the probability that the second number is at least $2$ greater than the first.

- (8) If the second number is at least $2$ greater than the first, determine the probability that the first number is $3$ or $4$.

### Task: Set of numbers [08.2022]

From $\{1,2,3,4,5,6\}$, one number is drawn at random, and then another is drawn without replacement.

- (7) Determine the probability that the second number is at least $3$ less than the first.

- (8) If the second number is at least $3$ less than the first, determine the probability that the first number is $4$ or $5$.

### Task: Marathon [06.2022]

A competitor first runs a $5$-kilometer race and then shoots at a target. The finishing time is uniformly distributed between $20$ and $34$ minutes. Depending on the finishing time, the competitor shoots a different number of times:

- less than $23$ minutes: $5$ shots;

- between $23$ and $29$ minutes inclusive: $4$ shots;

- more than $29$ minutes: $2$ shots.

Each shot hits independently with probability $1/3$.

- (15) Determine the probability that the competitor hits exactly $2$ times.

- (10) Given that the competitor hit exactly $2$ times, determine the probability that the finishing time was less than $23$ minutes.

### Task: Marathon [06.2022]

A competitor first runs a $5$-kilometer race and then shoots at a target. The finishing time is uniformly distributed between $21$ and $36$ minutes. Depending on the finishing time, the competitor shoots a different number of times:

- less than $25$ minutes: $5$ shots;

- between $25$ and $31$ minutes inclusive: $4$ shots;

- more than $31$ minutes: $2$ shots.

Each shot hits independently with probability $1/3$.

- (15) Determine the probability that the competitor hits exactly $2$ times.

- (10) Given that the competitor hit exactly $2$ times, determine the probability that the finishing time was less than $25$ minutes.

### Task: Computer modules [02.2022]

To assess the quality of a student project, a professor conducts two tests. Each project either passes or fails each test. A project that passes the first test proceeds to the second; otherwise it stops. The two tests are passed independently.

If the main module works correctly, the project passes both tests with probability $1$. If the main module does not work, the project passes each test with probability $1/4$. The main module works with probability $1/3$.

- (15) If a project that passed the first test is selected at random, what is the probability that its main module works correctly?

- (10) If a project that passed the first test is selected at random, what is the probability that it also passes the second test?

### Task: Computer modules [02.2022]

To assess the quality of a student project, a professor conducts two tests. Each project either passes or fails each test. A project that passes the first test proceeds to the second; otherwise it stops. The two tests are passed independently.

If the main module works correctly, the project passes both tests with probability $1$. If the main module does not work, the project passes each test with probability $1/5$. The main module works with probability $1/4$.

- (15) If a project that passed the first test is selected at random, what is the probability that its main module works correctly?

- (10) If a project that passed the first test is selected at random, what is the probability that it also passes the second test?

### Task [02.2021]

A professor has $7$ ungraded and $2$ graded tests mixed up and randomly selects $4$ of the $9$ tests. If exactly $2$ of the selected tests are graded, the professor finishes grading them in a time uniformly distributed between $8$ and $25$ minutes. Otherwise, the time is uniformly distributed between $15$ and $35$ minutes.

- (8) What is the probability that grading takes between $18$ and $21$ minutes, given that exactly $2$ selected tests are graded?

- (12) Determine the probability that grading takes between $18$ and $21$ minutes.

### Task: Virus [2020-21]

In a group tested for a virus, $6$ people have a negative test and $4$ have a positive test. To check the procedure, $3$ people are randomly selected for retesting and placed in a waiting room. The laboratory has two sample-collection rooms, so two people are randomly selected from the waiting room and taken into the rooms.

- (15) What is the probability that both people taken into the rooms had a previous positive test?

- (10) If both people taken into the rooms had a previous positive test, what is the probability that all three people in the waiting room had a previous positive test?

### Task: Certificate and ticket [11.2021]

Ana is outside a concert hall for which she bought a ticket. If she has neither her Covid certificate nor a ticket, she will not attend. The probability that she does not have a ticket is $0.2$, and the probability that she does not have her Covid certificate is $0.35$, independently of each other.

If Ana has no certificate but has a ticket, she will not attend with probability $0.45$. If she has a certificate but no ticket, she will not attend with probability $0.7$. If she has both, she will not attend with probability $0.85$.

- (15) What is the probability that Ana does not attend?

- (10) Given that Ana did not attend, what is the probability that she was missing at least one required document?

### Task: Covid-19 [06.2021]

Covid-19 test results are sometimes inaccurate. Test accuracy is the probability that the test detects the true condition. Assume the test has $99\%$ accuracy and $30\%$ of all people have Covid-19.

- (10) If a randomly selected patient tests positive, what is the probability that they actually have Covid-19?

- (10) Determine the probability that out of $10$ independent tests, $3$ are positive.

### Task: Coins [08.2021]

Marko has $10$ coins in his pocket. Nine are fair coins, and the tenth has two heads.

- (3) If Marko takes one coin out of his pocket, what is the probability that he drew the two-headed coin?

- (12) If Marko flips the coin he drew and it shows heads, what is the probability that he chose the two-headed coin?

- (5) Suppose Marko flips the chosen coin again and the second flip lands tails. What is the probability that one of the $9$ fair coins was chosen?
