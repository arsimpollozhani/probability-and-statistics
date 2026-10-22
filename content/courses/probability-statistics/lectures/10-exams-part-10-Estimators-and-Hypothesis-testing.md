---
type: exam
title: "Exam Part 5: Estimators and Hypothesis Testing"
description: "Exam problems on estimators and hypothesis testing, including maximum likelihood, method of moments, confidence intervals, and tests."
tags: ["estimators", "maximum likelihood", "hypothesis testing", "confidence intervals", "exam problems"]
order: 10
---

## Estimators

### Problem

Let

$$
X : \begin{pmatrix} 0 & 1 & 2 \\ \frac{2p}{3} & \frac{p}{3} & 1-p \end{pmatrix}
$$

- (10) Determine a method-of-moments estimator for $p$.

- (20) The following observations are assumed to form a random sample from the given distribution.

| $x_i$ | 0 | 1 | 2 |
|:--:|:--:|:--:|:--:|
| Frequency | 15 | 17 | 18 |

At the $5\%$ significance level, test whether these data come from the given distribution.

### Problem

The weight of students in North Macedonia is normally distributed with unknown mean and standard deviation. A random sample of $10$ student weights (in kg) is:

$$
55, 48, 62, 58, 65, 70, 52, 57, 59, 63
$$

Use maximum likelihood to find an estimator for the mean weight, then compute the estimate from the sample.

### Problem

A professor examines $50$ students. Each student is asked questions until they answer correctly, at which point the exam ends. The results are:

| Number of questions | 1 | 2 | 3 | 4 | 5 |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Number of students | 19 | 11 | 9 | 6 | 6 |

Let $X$ be the number of questions asked. What is the distribution of $X$? Estimate its parameter by maximum likelihood.

### Problem

Let $X$ and $Y$ be estimators for $\theta$. $X$ is uniform on $(\theta-1,\theta+1)$, and $Y$ has distribution

$$
P(Y=t) =
\begin{cases}
10^{-2}, & t=\theta-10,\\
1-2\cdot10^{-1}, & t=\theta,\\
10^{-2}, & t=\theta+10.
\end{cases}
$$

Are these estimators unbiased? Which is better, and why?

### Problem

At a wedding restaurant, guests are offered Coca-Cola and Pepsi. The probability that a guest chooses Coca-Cola is $p$.

- (10) Use maximum likelihood to determine an estimator for $p$.

- (3) At one wedding, $55$ of $100$ guests ordered Pepsi. Determine an MLE estimate for $p$.

### Problem

Find the MLE for $\theta$ for a distribution with density

$$
p(x)=
\begin{cases}
e^{\theta-x}, & x\ge 0,\\
0, & x<0,
\end{cases}
$$

based on a sample of size $n$.

### Problem

Let $X$ be the number of typing errors made in one minute. The table gives the data for one typist:

| Number of errors | 0 | 1 | 2 | 3 | 4 | 5 |
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Number of minutes | 77 | 90 | 55 | 30 | 5 | 2 |

Errors occur independently and cannot occur simultaneously. Which distribution is appropriate for modeling $X$? Using the data, test this assumption at $\alpha=0.01$ and find the MLE of the unknown parameter.

### Problem

In the first two rounds of the group stage of the 2017/18 Champions League, $32$ matches were played:

| First round | Second round |
|:--:|:--:|
| 3-0 | 5-0 |
| 2-2 | 3-0 |
| 1-2 | 1-4 |
| 1-1 | 1-1 |
| 3-0 | 3-0 |
| 0-4 | 2-0 |
| 0-5 | 0-3 |
| 2-1 | 3-1 |
| 6-0 | 1-2 |
| 1-3 | 2-0 |
| 0-0 | 1-2 |
| 1-1 | 0-3 |
| 3-0 | 0-1 |
| 3-0 | 1-3 |
| 2-3 | 2-0 |
| 3-1 | 0-3 |

Assume the number of goals scored by the away team in a match is Poisson with parameter $\lambda$. Find the MLE of $\lambda$ and estimate it from the data.

### Problem

After an analysis, all machines in a factory were upgraded and the service regulations changed: each machine is checked daily for a safety problem, which occurs with probability $p_1$. A machine is serviced after $5$ safety problems. A consultant recorded the number of days until each of $40$ machines was serviced:

$$
\begin{aligned}
&18, 32, 16, 15, 23, 26, 26, 54, 8, 34, 12, 10, 17, 15, 12, 16, 13, 10,\\
&17, 18, 9, 0, 29, 24, 11, 17, 10, 45, 39, 21, 16, 2, 4, 9, 4, 26, 29, 14, 28, 32
\end{aligned}
$$

with $\Sigma=761$. Estimate $p_1$ by maximum likelihood.

### Problem

The number of points scored by the basketball team of North Macedonia against a given opponent is normally distributed with unknown mean $\mu$ and variance $\sigma^2$. The team's scores in $10$ matches are:

$$
59, 62, 59, 74, 70, 61, 62, 66, 62, 75
$$

(10) Use maximum likelihood to estimate $\mu$.

### Problem

A box contains one black ball and $k$ white balls. An experiment consists of drawing balls with replacement until the black ball is drawn. After $15$ experiments, the numbers of draws were:

$$
13, 7, 1, 5, 4, 5, 11, 3, 1, 14, 1, 3, 4, 1, 6
$$

Estimate the number of white balls using the MLE.

### Problem

A handball match lasts one hour. Assume that goals in disjoint intervals are independent, the probability of a goal in a small interval is proportional to its length, and two goals cannot occur simultaneously.

- What is the distribution of $X$, the number of goals in one match?

- Find $E[X]$.

- Find a method-of-moments estimator for the unknown parameter and estimate it from the Group B data from the 2017 Handball World Championship.

| Group | Goals | $\bar{x}$ | $\Sigma x_i^2$ |
|:--:|:--|:--:|:--:|
| A | 47, 68, 42, 50, 52, 52, 59, 51, 44, 65, 51, 59, 52, 51, 61 | 53.6 | 43856 |
| B | 67, 64, 48, 51, 47, 53, 44, 51, 64, 56, 52, 54, 77, 54, 62 | 56.2 | 48586 |

### Problem

At center $A$, on each day of the week there may independently be a need to call a specialist. The probability $p$ that a specialist is called is the same each day. Let $U$ be the number of days in a week on which a specialist is called.

- Derive $E[U]$.

- The director of center $A$ collected data over $40$ weeks and computed:

$$
\sum_{i=1}^{40} y_i = 189
$$

Find a method-of-moments estimate of $p$.

### Problem

The results of the women's $200$ m semifinals at the 2016 Olympics, in seconds, are:

First semifinal:

$$
21.96, 22.13, 22.38, 22.49, 22.69, 22.83, 22.90, 23.45
$$

Second semifinal:

$$
22.28, 22.42, 22.50, 22.55, 22.81, 22.94, 22.99, 22.99
$$

Assuming a normal distribution $N(\mu,\sigma^2)$, find method-of-moments estimators for the unknown parameters and compute their estimates.

### Problem

In a factory, chips are produced in batches of $100$, and each chip is defective with probability $p$, independently of the others. An engineer wants to determine the probability that a random batch has fewer than $4$ defective chips. Using the method-of-moments and maximum-likelihood estimators of $p$, estimate this probability.

### Problem

Each day, the administrator of a computer center runs an antivirus program and reviews its report. Checks continue daily until $3$ negative reports are obtained, after which a detailed test of the center is performed. After $40$ detailed tests, the administrator recorded the number of checks $X$ needed for each test:

| $x_k$ | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|:--|:--|:--|:--|:--|:--|:--|:--|
| $n_k$ | 10 | 10 | 8 | 6 | 3 | 1 | 2 |

The probability of a negative report is $p$. Find the MLE of $p$.

### Problem

At each cash register in Vero, customers are served independently, and $k$ customers are served per hour. The registers are never idle.

- If Vero operates three cash registers, find an estimate for the total number of customers served per hour.

- The following data were collected for the number of customers served per hour at the first register:

$$
33, 30, 18, 21, 19, 28, 18, 22, 31, 28, 25, 17, 20, 32, 34
$$

Find the MLE of the average number of customers served per hour. What is the probability that the register serves $20$ customers in the next hour?

### Problem

A rectangle has random sides $X$ and $2X$, where $X$ has density

$$
f(x) =
\begin{cases}
\frac{x}{\theta}, & 0<x<\theta,\ \theta>0,\\
0, & \text{otherwise}.
\end{cases}
$$

Based on a sample $X_1,\dots,X_n$ of side lengths, find a method-of-moments estimator for the expected area.

### Problem

The values $6, 5, 10, 7, 7, 8, 6, 5, 2, 2$ form a sample from a Poisson random variable $X$ with unknown parameter $\theta$. Use maximum likelihood to estimate $E[X]$.

### Problem

Service time at a bank counter (in minutes) is exponentially distributed with parameter $\lambda$. The service times for $10$ clients are:

$$
7.4, 7.5, 8.5, 29.2, 5.5, 21.6, 4.3, 8.1, 5.3, 1.7
$$

Estimate $\lambda$. What is the average service time per client?

### Problem

A system has $4$ communication channels. A signal is successfully transmitted over channel $i$ with probability

$$
p_i = \frac{1}{5-i}, \quad i=1,2,3,4.
$$

Before transmission, the system's reliability is checked. Let $p$ be the probability that the system is reliable.

The check is performed $4$ times. If it succeeds $i$ times ($i=1,2,3,4$), the signal is sent over channel $i$; if $i=0$, no signal is sent.

During the day, the numbers of signals sent were: $12$ on channel $1$, $10$ on channel $2$, $7$ on channel $3$, $3$ on channel $4$, and $5$ were not sent. Estimate $p$.

### Problem

A product is tested until it passes twice. Each test is passed with probability $p$. Estimate $p$.

### Problem

Let $X$ have density

$$
p(x) =
\begin{cases}
\lambda x^{\lambda-1}, & 0<x<1,\\
0, & \text{otherwise},
\end{cases}
$$

for $\lambda>0$. Determine an estimator for $\lambda$ using (a) the method of moments and (b) maximum likelihood.

## Hypothesis Testing

### Problem

To compare online and classical learning in the January session of Probability and Statistics, $50$ students who studied online and $41$ who studied classically were randomly selected from those who passed. The online group had mean score $67.25$ and variance $3.25$; the classical group had mean $49.75$ and variance $2.75$. Assume the scores are normally distributed.

- (10) Test equality of variances at $\alpha=0.05$.

- (15) At $\alpha=0.05$, test whether online students score higher on average than classical students, using the result of part (a).

### Problem

A French fries manufacturer checks production quality. Standards require a package mass of $750$ g, normally distributed with standard deviation $5$ g. A sample of $5$ packages has masses:

$$
775, 760, 745, 740, 738
$$

At the $5\%$ significance level, can we conclude that the mean package mass has changed?

### Problem

The average salary in North Macedonia was $29{,}000$ denars. A sample of $100$ employees in June had an average salary of $30{,}000$ denars. The standard deviation is known to be $2500$ denars. At $\alpha=0.05$, can we conclude that the average June salary is higher than in March?

### Problem

A 2015 study in Macedonia found that the average age of women in IT was $30$ years. Researchers believe this has increased. A 2020 sample of $97$ women in IT had an average age of $35.4$ years; the standard deviation is known to be $7.3$. At $\alpha=0.01$, test whether the researchers' belief is correct.

### Problem

The pass rate for a course is $30\%$, with every student equally likely to pass. After a teaching reform, $350$ of $1000$ students passed in the first year. At $\alpha=0.05$, test whether the pass rate remained the same against the alternative that it increased.

### Problem

A telephone company surveyed the daily time customers spend on mobile phones. For a sample of $25$ customers, the sample standard deviation was $12.5$ minutes. Assuming normality, find the $95\%$ confidence interval for the population variance of daily talk time.

### Problem

At a wedding restaurant, guests are offered Coca-Cola and Pepsi. The probability that a guest chooses Coca-Cola is $p$.

- (10) Use maximum likelihood to determine an estimator for $p$.

- (3) At one wedding, $55$ of $100$ guests ordered Pepsi. Determine an MLE estimate for $p$.

- (15) Test the hypothesis that the proportion of Coca-Cola orders is $0.5$ against the alternative that it is less than $0.5$, at $\alpha=0.05$.

### Problem

We want to analyze whether the sale of Groupon coupons depends on the discount size. The table gives the discount percentages and numbers of coupons sold for $12$ products.

| Product | Discount $p_i$ (%) | Sold $x_i$ | $p_i^2$ | $x_i^2$ | $p_i x_i$ |
|:--:|:--:|:--:|:--:|:--:|:--:|
| 1 | 38 | 4 | 1444 | 16 | 152 |
| 2 | 73 | 28 | 5329 | 784 | 2044 |
| 3 | 53 | 21 | 2809 | 441 | 1113 |
| 4 | 45 | 9 | 2025 | 81 | 405 |
| 5 | 36 | 6 | 1296 | 36 | 216 |
| 6 | 69 | 25 | 4761 | 625 | 1725 |
| 7 | 41 | 9 | 1681 | 81 | 369 |
| 8 | 53 | 4 | 2809 | 16 | 212 |
| 9 | 65 | 16 | 4225 | 256 | 1040 |
| 10 | 47 | 99 | 2209 | 9801 | 4653 |
| 11 | 52 | 23 | 2704 | 529 | 1196 |
| 12 | 36 | 165 | 1296 | 27225 | 5940 |
| **Total** | **608** | **409** | **32588** | **39891** | **19065** |

Find the $95\%$ confidence interval for the average number of coupons sold. Assume the data are normally distributed.

### Problem

A researcher wants to determine the average time a mechanic needs to change car tires.

- If $\sigma=6.1$ minutes, what sample size is needed to estimate the average time with $95\%$ confidence so that the estimate deviates at most $0.5$ minutes from the true mean?

- A sample of size $51$ gave a sample standard deviation of $1.5$ minutes. At the $5\%$ significance level, can it be considered that the previous assumption about the standard deviation was reasonable?

### Problem

The daily water consumption of a family is normally distributed. Let $x_k$ denote the amount consumed in one day and $n_k$ the number of days on which $x_k$ liters were consumed.

| $x_k$ | 2.5 | 7.5 | 12.5 | 17.5 | 22.5 | 27.5 | 32.5 |
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| $n_k$ | 1 | 3 | 4 | 8 | 6 | 4 | 2 |

- Calculate a $95\%$ confidence interval for the average daily water consumption.

- Test the hypothesis that the average daily water consumption is $24$ liters at $\alpha=0.05$.

Additional calculations:

$$
\bar{x} = 18.75, \quad s^2 = 58.5648, \quad s = 7.6528
$$
