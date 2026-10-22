---
title: "Probability Model of a Random Sample and the Central Limit Theorem"
description: "Populations, samples, statistics, the sample mean and variance, and why averages become approximately normal."
tags: ["random sample", "central limit theorem", "sample mean", "sample variance", "statistics"]
order: 2
---

## Why this lecture matters

Probability starts with a known model and asks what data it should produce. Statistics starts with data and asks which model, or which parameter value, could have produced them. This lecture builds the bridge between the two directions: it defines what a **random sample** is, introduces **statistics** as functions of the sample, and proves the two facts that make inference possible:

1. the sample mean is an unbiased estimator of the population mean, and its variance shrinks as the sample grows;
2. the **central limit theorem** says that, for large samples, the sample mean is approximately normal regardless of the shape of the original distribution.

At a high level, the central limit theorem explains why the normal distribution is everywhere: whenever many independent random effects are added together, their sum looks normal. This is the reason we can attach error bars to an average, run a $t$-test on a small experiment, or build a confidence interval from a single sample.

In real life, these ideas underlie opinion polls, clinical trials, quality control and financial risk. In computer science they appear in performance benchmarking (averaging noisy runtimes), randomized algorithms, network traffic modelling and simulation. In machine learning they justify cross-validation averages, mini-batch gradient noise, uncertainty estimates for evaluation metrics, and the use of the normal approximation in many statistical learning methods.

## Mathematical statistics as a science

Mathematical statistics deals with data: their collection, analysis, representation, interpretation, and the drawing of scientifically justified conclusions. It is applied in the natural and social sciences, in the humanities, and in industry.

### Data

**Statistical data** are characteristics or pieces of information gathered by observing or studying uniform objects. For example, for the population of all ten-year-old children in Skopje, we might examine height, weight, school success, gender, nationality and eye colour. For the computers at FINKI, we might examine processor speed, RAM size and disk capacity.

### Population and feature

A set of uniform objects or results of an operation that share one or more common characteristics is called a **population**. The common characteristic is called a **feature**.

The population is denoted by $\Omega$, because it is the set of all possible outcomes of the underlying experiment, i.e. the set of elementary events.

For the population "children in Skopje", possible features are height, weight, success at school, gender, nationality and eye colour. For the population "computers at FINKI", possible features are processor speed, RAM size and disk capacity.

The value a feature takes varies from one individual to another and cannot be predicted reliably for a specific individual. Therefore, a feature is modelled as a **random variable**. In statistics we work with data collected for different features.

### Types of data

Data can be broadly classified as follows:

- **Numerical** (quantitative): discrete or continuous;
- **Categorical** (qualitative): nominal or ordinal.

#### Numerical data

**Numerical data** are expressed as numbers. They come either from measurements (height, weight, IQ, blood pressure) or from counts (number of shares owned, number of students in a group). Numerical data are also called **quantitative data**.

Numerical data are further divided into two types:

- **Discrete data** arise from counting. The set of possible values is finite or countably infinite. For example, the number of heads in $100$ coin tosses can be any integer from $0$ to $100$, while the number of tosses needed to obtain $100$ heads can be any integer from $100$ onward.
- **Continuous data** arise from measurement. Their possible values can only be described using intervals on the real line. For example, the working time of a machine might lie in $[0,T]$, where $T$ is the maximum working life and may be infinite. Such data come from an uncountable set.

#### Categorical data

**Categorical data** describe characteristics such as gender, nationality, eye colour, marital status or hometown. Numbers may be assigned to categories (for example, "1" for male and "2" for female), but those numbers have no mathematical meaning. Categorical data are also called **qualitative data**.

Categorical data can be **nominal** or **ordinal**.

**Nominal data** are labels with no quantitative value and no natural order. Employee identification numbers, index numbers, gender, religion, ethnicity, geographic location and place of birth are typical examples. Changing the order of nominal values does not change their meaning.

**Ordinal data** can be ranked or ordered. For example, a supervisor might rank three employees by productivity using the numbers $1$, $2$ and $3$. However, the difference between ranks $1$ and $2$ need not equal the difference between ranks $2$ and $3$; the distances between consecutive numbers are not necessarily equal. Ordinal scales are often used for non-numerical characteristics such as happiness or customer satisfaction.

## The goal of statistics

In most practical problems the distribution of a feature is not known in advance. The aim of statistics is to determine that distribution, or to estimate its parameters, using observed data.

Depending on the values they can take, features are **numerical** (quantitative) or **categorical** (qualitative). Numerical features can be discrete or continuous, just like random variables.

### Samples

It is usually impossible to examine every element of a population. Examinations may take too long, cost too much, or even destroy the objects being tested. Therefore, we select a part of the population, perform the tests on it, and draw conclusions that apply to the whole population with a certain probability.

The part of the population on which the tests are carried out is called a **sample**. The number of elements in the sample is the **sample size**.

### Representative sampling

Conclusions drawn from a sample should be valid for the entire population. For this, the sample must be **representative**: it should be a miniature model of the population. Every element of the population must have an equal chance of entering the sample, and the selection of each element should be **independent and random**.

### The 1936 Literary Digest poll

Deviation from random selection can lead to serious errors. A famous example is the 1936 poll by the American magazine *Literary Digest* about the upcoming US presidential election between F. Roosevelt and A. Landon. The magazine selected addresses from telephone directories, magazine subscriber lists and club membership lists, mailed surveys to about $10$ million people, and received about $2.4$ million responses. It spent a great deal of money sending the cards and processing the data, and announced that A. Landon would win. In fact, F. Roosevelt won, so the forecast was wrong.

What went wrong? Two errors were made:

1. During the economic crisis, only the wealthiest people had telephones, so the sampling frame underrepresented poorer voters.
2. The survey was mostly answered by business people who were in the habit of answering letters, and they tended to support Landon. This is **non-response bias**.

A rival poll by George Gallup used a much smaller but more carefully chosen quota sample of about $50{,}000$ respondents and correctly predicted Roosevelt's victory. Gallup started from the fact that society consists of different social layers and that members of the same layer tend to support the same candidate. By studying those layers, he obtained conclusions valid for the whole country.

## Random samples

For a given population, suppose we observe the feature $X$. Let $X_1$ be the value of $X$ observed in the first run of the experiment, let $X_2$ be the value in the second run, and so on, up to $X_n$ in the $n$-th run. These random variables have the same distribution as $X$, and they are independent.

**Definition 1.** The random vector $(X_1,X_2,\dots,X_n)$ is a **random sample** for the feature $X$ if $X_1,X_2,\dots,X_n$ are independent random variables and every $X_i$ has the same distribution as $X$.

> **Intuition.** A random sample is best imagined as repeating the same experiment $n$ times under identical conditions, without one observation influencing another. Each $X_i$ is a separate copy of the same random mechanism, so all $X_i$ share the distribution of $X$ but may produce different values. The vector is random before the data are collected; after collection it becomes a concrete list of numbers.

### Sample realizations and the data space

When $X_1,X_2,\dots,X_n$ take concrete values from the population, we obtain one **realization** of the random sample.

For example, let $(X_1,X_2,X_3,X_4,X_5)$ be a random sample of size $5$ for the feature "height of FINKI students". If five such students are selected at random and measured, we obtain one realization of the sample. For instance,

$$
(192,\ 184,\ 170,\ 185,\ 190)
$$

is one realization, while

$$
(187,\ 190,\ 167,\ 178,\ 194)
$$

is another realization based on five other random choices.

**Definition 2.** The set $W \subseteq \mathbb{R}^n$ of all possible realizations $(x_1,x_2,\dots,x_n)$ of a random sample of size $n$ is called the **sample data space**.

> **Intuition.** The random sample lives in the abstract world of random variables, while its realization is a point in the data space $W$. Thinking of $W$ as the set of all lists of $n$ possible observations clarifies why a statistic is simply a function defined on $W$: it takes a whole list of data and returns one number.

### The empirical distribution

**Definition 3.** Let $(X_1,X_2,\dots,X_n)$ be a random sample for the feature $X$. The function

$$
F_n(x) = \frac{\text{number of sample elements smaller than } x}{n}
= \frac{1}{n}\sum_{i=1}^{n} I_{\{X_i < x\}}
$$

is called the **empirical distribution function** of $X$.

Here $I_{\{X_i<x\}}$ is the indicator of the event $\{X_i<x\}$: it equals $1$ whenever $X_i<x$, and $0$ otherwise. Summing the indicators counts how many sample elements are smaller than $x$. The graph of $F_n$ is a staircase with jumps of height $1/n$ at each observed data value.

> **Intuition.** For a fixed $x$, the empirical distribution reports the proportion of observations that fell below $x$. As $x$ moves to the right, this proportion can only grow, which produces the staircase. The height of each step is exactly $1/n$, because adding one more observation below the threshold increases the count by one, i.e. by $1/n$ of the sample.

### Convergence of the empirical distribution

As $n$ increases, the empirical distribution function of $X$ approaches the true distribution function of the feature $X$. In practice, as $n \to +\infty$, the empirical distribution tends to the true distribution.

On the graphs, the empirical distribution function is drawn as a black line and the true distribution function as a red line. The larger the sample, the closer the black staircase is to the red curve.

> **Intuition.** This is the law of large numbers seen through a microscope: each jump of the staircase becomes more reliable as more data are collected, so the whole staircase settles onto the smooth true distribution function. This is why summarizing a sample can tell us something about an entire population.

## Statistics

Many statistical methods use functions of the sample that are themselves random variables. We call these functions **statistics**.

**Definition 4.** A function of the random sample $(X_1,X_2,\dots,X_n)$ for the feature $X$ that is itself a random variable is called a **statistic**.

For a specific realization $(x_1,x_2,\dots,x_n)$, a statistic takes a specific value, called the **realization of the statistic**.

### Example: a sample mean

Let $(X_1,X_2,X_3,X_4,X_5)$ be a random sample of size $5$ for the feature "height of FINKI students". Then

$$
U = \frac{X_1+X_2+X_3+X_4+X_5}{5}
$$

is a function of the sample and is itself a random variable, so $U$ is a statistic. For the realization $(192,184,170,185,189)$,

$$
U = \frac{192+184+170+185+189}{5} = 184.
$$

Another choice of five students gives another realization of the random sample and therefore another value of $U$.

> **Intuition.** A statistic is a recipe, not a number. Before sampling, the recipe produces a random variable $U$; after sampling, the same recipe produces a single realized number. Different samples are different inputs, so the same recipe can output different numbers.

## Important statistics

If $(X_1,X_2,\dots,X_n)$ is a random sample of size $n$, we can define many statistics. The most common are:

- the sample mean (arithmetic mean);
- the sample variance and sample standard deviation;
- sample moments;
- ordered statistics;
- the median and percentiles;
- the range.

## The sample mean

Let $(X_1,X_2,\dots,X_n)$ be a random sample for a random variable $X$ with mean $\mu$ and variance $\sigma^2$. Thus $X_1,X_2,\dots,X_n$ are independent and identically distributed, each with mean $\mu$ and variance $\sigma^2$.

**Definition 5.** The **sample mean** of $X_1,X_2,\dots,X_n$ is

$$
\overline{X} = \frac{1}{n}\sum_{i=1}^{n} X_i.
$$

### Properties of the sample mean

**Theorem 1.** If $X$ has mean $E[X]=\mu$ and variance $D[X]=\sigma^2$, and $(X_1,X_2,\dots,X_n)$ is a random sample for $X$, then

$$
E[\overline{X}] = \mu,
\qquad
D[\overline{X}] = \frac{\sigma^2}{n}.
$$

**Proof.** Since $E[X_i]=\mu$ and $D[X_i]=\sigma^2$ for every $i=1,2,\dots,n$, linearity of expectation gives

$$
E[\overline{X}]
= E\left(\frac{1}{n}\sum_{i=1}^{n}X_i\right)
= \frac{1}{n}\sum_{i=1}^{n}E[X_i]
= \frac{1}{n}\sum_{i=1}^{n}\mu
= \frac{n\mu}{n}
= \mu.
$$

For the variance, independence of $X_i$ and $X_j$ for $i\neq j$ gives

$$
D[\overline{X}]
= D\left(\frac{1}{n}\sum_{i=1}^{n}X_i\right)
= \frac{1}{n^2}\sum_{i=1}^{n}D[X_i]
= \frac{1}{n^2}\sum_{i=1}^{n}\sigma^2
= \frac{n\sigma^2}{n^2}
= \frac{\sigma^2}{n}.
$$

> **Intuition.** Averaging does not move the centre: the average of repeated observations should be centred at the same $\mu$. Averaging does reduce spread, because independent deviations from $\mu$ tend to cancel. The factor $n^2$ in the variance comes from scaling each observation by $1/n$; this is why the standard deviation of $\overline{X}$ shrinks like $1/\sqrt{n}$ rather than like $1/n$.

## The central limit theorem

One of the most significant results in probability and statistics is the **central limit theorem**, which further emphasizes the importance of the normal distribution. It says that a sum of a large number of independent and identically distributed random variables is approximately normal, regardless of the distribution of the individual variables. The same holds for the average of a large number of independent and identically distributed random variables.

This is why the normal distribution is one of the most common distributions of real quantities. Heights and weights of people often have a normal distribution, and measurement errors in physics and chemistry often do as well.

**Theorem 2 (Central limit theorem).** Let $X_1,X_2,\dots,X_n$ be independent and identically distributed random variables with mean $\mu$ and variance $\sigma^2$. If $n$ is large enough, then:

- the sum $\displaystyle\sum_{i=1}^{n}X_i$ has approximately a normal distribution with mean $n\mu$ and variance $n\sigma^2$:

$$
\sum_{i=1}^{n}X_i \approx N(n\mu,\ n\sigma^2);
$$

- the sample mean $\displaystyle\overline{X}=\frac{1}{n}\sum_{i=1}^{n}X_i$ has approximately a normal distribution with mean $\mu$ and variance $\sigma^2/n$:

$$
\overline{X} \approx N\left(\mu,\ \frac{\sigma^2}{n}\right).
$$

> **Intuition.** Individual observations may be extremely non-normal, but when many independent contributions are added, their irregularities average out. The centre of the sum is the sum of the centres, $n\mu$, and the variances add, giving $n\sigma^2$. Dividing by $n$ turns these into $\mu$ and $\sigma^2/n$ for the average. The normal shape emerges from the accumulation of many small independent effects, which is why the theorem is so widely applicable.

The central limit theorem gives the asymptotic distribution of the sample sum and the sample mean as $n\to\infty$. The approximation is usually good for $n\ge 30$ and improves as $n$ increases.

The theorem is illustrated by the following example. Let $\overline{X}$ be the average of the values obtained by tossing $n$ dice. The figure shows the distributions for $n=1,2,3,5,10$.

![](/images/lectures/02-stats-probability-of-random-samples/image.png)

The shape of the distribution is already close to normal for $n=3$ and $n=5$. Note that the distribution of the average is discrete while the normal distribution is continuous, so the approximation improves as $n$ grows. For many distributions, $n>30$ is considered sufficient for a good normal approximation.

### Standardizing the sample mean

From the central limit theorem, after standardization,

$$
\frac{\sum_{i=1}^{n}X_i - n\mu}{\sqrt{n\sigma^2}}
= \frac{\sum_{i=1}^{n}X_i - n\mu}{\sigma\sqrt{n}}
= \frac{\overline{X}-\mu}{\sigma/\sqrt{n}}
\approx N(0,1).
$$

Therefore,

$$
P\left(\frac{\sum_{i=1}^{n}X_i - n\mu}{\sqrt{n\sigma^2}} < x\right)
= P\left(\frac{\overline{X}-\mu}{\sigma/\sqrt{n}} < x\right)
\approx \Phi(x),
$$

where $\Phi$ is the cumulative distribution function of the standard normal distribution. Values of $\Phi(x)$ can be read from standard normal tables or computed with `R`.

### Worked example: total file size

A hard disk has $330$ MB of free space. Is that enough to store $300$ independent figures if each figure has expected size $1$ MB and variance $0.25$ MB$^2$?

Let $S$ be the total size of the $300$ figures. Then

$$
E[S] = 300\cdot 1 = 300,
\qquad
D[S] = 300\cdot 0.25 = 75,
$$

so the standard deviation of $S$ is

$$
\sigma_S = \sqrt{75}\approx 8.66.
$$

By the central limit theorem, $S$ is approximately normal, hence

$$
P\{S\le 330\}
\approx \Phi\left(\frac{330-300}{\sqrt{75}}\right)
\approx \Phi(3.46)
\approx 0.9997.
$$

The free space is therefore sufficient with very high probability.

### Worked example: average of $36$ observations

Let $X_1,X_2,\dots,X_{36}$ be independent and identically distributed random variables with mean $\mu=8$ and variance $\sigma^2=9$. Find the probability that the average of these random variables lies between $7.8$ and $8.2$.

The sample mean has mean $8$ and standard deviation

$$
\frac{\sigma}{\sqrt{n}} = \frac{3}{6} = 0.5.
$$

Thus

$$
\begin{aligned}
P\{7.8 < \overline{X} < 8.2\}
&\approx \Phi\left(\frac{8.2-8}{0.5}\right)
- \Phi\left(\frac{7.8-8}{0.5}\right) \\
&= \Phi(0.4) - \Phi(-0.4) \\
&\approx 0.6554 - 0.3446 \\
&= 0.3108.
\end{aligned}
$$

## Sample variance

Let $(X_1,X_2,\dots,X_n)$ be a random sample for a random variable $X$ with mean $\mu$ and variance $\sigma^2$.

**Definition 6.** The **sample variance** is

$$
S^2 = \frac{1}{n-1}\sum_{i=1}^{n}(X_i-\overline{X})^2,
$$

and the **sample standard deviation** is

$$
S = \sqrt{S^2}.
$$

**Theorem 3.** The sample variance can be written in the computationally convenient form

$$
S^2 = \frac{\sum_{i=1}^{n}X_i^2 - n\overline{X}^2}{n-1}.
$$

**Proof.**

$$
\begin{aligned}
S^2
&= \frac{1}{n-1}\sum_{i=1}^{n}(X_i-\overline{X})^2 \\
&= \frac{1}{n-1}\sum_{i=1}^{n}\left(X_i^2 - 2\overline{X}X_i + \overline{X}^2\right) \\
&= \frac{1}{n-1}\left(\sum_{i=1}^{n}X_i^2 - 2\overline{X}\sum_{i=1}^{n}X_i + n\overline{X}^2\right) \\
&= \frac{1}{n-1}\left(\sum_{i=1}^{n}X_i^2 - 2\overline{X}\cdot n\overline{X} + n\overline{X}^2\right) \\
&= \frac{\sum_{i=1}^{n}X_i^2 - n\overline{X}^2}{n-1}.
\end{aligned}
$$

This form is used more often because it is easier to calculate.

> **Intuition.** Why divide by $n-1$ instead of $n$? The deviations $X_i-\overline{X}$ are measured from the sample mean, which itself was computed from the same data. This uses up one degree of freedom, making the deviations slightly smaller than deviations from the true unknown mean. Dividing by $n-1$ compensates for that and makes $S^2$ unbiased for $\sigma^2$.

**Theorem 4.** If $X$ has mean $E[X]=\mu$ and variance $D[X]=\sigma^2$, and $(X_1,X_2,\dots,X_n)$ is a random sample for $X$, then

$$
E[S^2] = \sigma^2.
$$

**Proof.**

$$
\begin{aligned}
E[S^2]
&= E\left(\frac{\sum_{i=1}^{n}X_i^2 - n\overline{X}^2}{n-1}\right) \\
&= \frac{1}{n-1}\left[\sum_{i=1}^{n}E[X_i^2] - nE[\overline{X}^2]\right] \\
&= \frac{1}{n-1}\left[n(\sigma^2+\mu^2) - n\left(\frac{\sigma^2}{n}+\mu^2\right)\right] \\
&= \frac{1}{n-1}(n-1)\sigma^2 \\
&= \sigma^2.
\end{aligned}
$$

## Other important statistics

### Sample moments

**Definition 7.** For a given $r\in\mathbb{N}$, the statistic

$$
Z_r = \frac{1}{n}\sum_{i=1}^{n}X_i^r
$$

is called the **$r$-th sample moment**. In particular, $Z_1=\overline{X}$.

**Definition 8.** For a given $r\in\mathbb{N}$, the statistic

$$
M_r = \frac{1}{n}\sum_{i=1}^{n}(X_i-\overline{X})^r
$$

is called the **$r$-th central sample moment**. In particular,

$$
S^2 = \frac{n}{n-1}M_2.
$$

### Median and percentiles

**Definition 9.** The **sample median** $M$ is the number in the middle of the ordered sample. Exactly $50\%$ of the ordered data are smaller than it and $50\%$ are larger. It is defined by

$$
M =
\begin{cases}
X_{((n+1)/2)}, & \text{if } n \text{ is odd},\\[4pt]
\dfrac{X_{(n/2)}+X_{(n/2+1)}}{2}, & \text{if } n \text{ is even}.
\end{cases}
$$

**Percentiles** divide the ordered data into $100$ equal-sized parts, each containing about $1\%$ of the data. There are $99$ percentiles. The $P$-th percentile is a value such that approximately $P$ percent of the data lie to its left and approximately $(100-P)$ percent lie to its right. For example, the $87$-th percentile $P_{87}$ is a value for which $87\%$ of the data are to the left and no more than $13\%$ are to the right.

The $P$-th percentile is calculated as follows.

1. Sort the data in non-descending order.
2. Compute the position

$$
i = \frac{P}{100}\cdot n,
$$

where $P$ is the required percentile and $n$ is the sample size.
3. If $i$ is an integer, the $P$-th percentile is the average of the values at positions $i$ and $i+1$. If $i$ is not an integer, the $P$-th percentile is the value at position $\lfloor i+1\rfloor$, where $\lfloor\cdot\rfloor$ denotes the integer part.

Different software packages use slightly different interpolation conventions; the definition above is the one used in these notes.

### Quartiles

**Quartiles** divide a sample into four parts of roughly equal size. The data must first be sorted in non-descending order. The three main quartiles are:

- the **first quartile** $q_1=Q_{0.25}$, also called the lower quartile, below which $25\%$ of the data lie;
- the **second quartile** $q_2$, which is the sample median, below which $50\%$ of the data lie;
- the **third quartile** $q_3=Q_{0.75}$, also called the upper quartile, below which $75\%$ of the data lie.

![](/images/lectures/02-stats-probability-of-random-samples/image_2.png)

## Ordered statistics

Let $(X_1,X_2,\dots,X_n)$ be a random sample and let $(x_1,x_2,\dots,x_n)$ be one of its realizations. Order the realized values in non-decreasing order and denote them by

$$
(x_{(1)},x_{(2)},\dots,x_{(n)}),
\qquad
x_{(1)}\le x_{(2)}\le\cdots\le x_{(n)}.
$$

**Definition 10.** Let $X_{(k)}$ be the random variable that, in each ordered realization $(x_{(1)},x_{(2)},\dots,x_{(n)})$, takes the $k$-th smallest value $x_{(k)}$, for $k=1,2,\dots,n$. The random variables $X_{(1)},X_{(2)},\dots,X_{(n)}$ are called **ordered statistics**.

> **Intuition.** Ordering throws away the original labels and keeps only the relative positions of the data. The smallest observation becomes $X_{(1)}$, the largest becomes $X_{(n)}$, and the median sits in the middle. This is useful because many robust summaries depend only on position, not on the exact values of the extremes.

The first ordered statistic is

$$
X_{(1)} = \min\{X_1,X_2,\dots,X_n\},
$$

and the $n$-th ordered statistic is

$$
X_{(n)} = \max\{X_1,X_2,\dots,X_n\}.
$$

**Definition 11.** The statistic

$$
R = X_{(n)} - X_{(1)}
$$

is called the **range** of the sample. Each of its realizations corresponds to the range of the observed data.

### Distribution of the sample mean and variance

**Theorem 5.** Let $(X_1,X_2,\dots,X_n)$ be a random sample of size $n\ge 2$ from a normal distribution $N(\mu,\sigma^2)$. Then:

- $\overline{X}$ has the distribution $N(\mu,\sigma^2/n)$;
- $\dfrac{(n-1)S^2}{\sigma^2}$ has a chi-squared distribution with $n-1$ degrees of freedom;
- $\overline{X}$ and $S^2$ are independent random variables;
- the random variable

$$
T = \frac{\dfrac{\overline{X}-\mu}{\sigma/\sqrt{n}}}{\sqrt{\dfrac{(n-1)S^2}{\sigma^2(n-1)}}}
= \frac{\overline{X}-\mu}{S}\sqrt{n}
$$

has a Student $t$-distribution with $n-1$ degrees of freedom.

> **Intuition.** The last result explains where the $t$-test comes from. The numerator is a standardized average, and the denominator is a standardized sample variance. Their ratio has a $t$-distribution because the denominator is itself random: replacing the unknown $\sigma$ by $S$ adds uncertainty, which is why the $t$-distribution has heavier tails than the normal distribution.
