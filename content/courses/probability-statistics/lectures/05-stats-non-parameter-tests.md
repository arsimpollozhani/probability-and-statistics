---
title: "Nonparametric Tests: Pearson's Chi-Square Test"
description: "Goodness-of-fit tests and tests of independence for categorical data using Pearson's chi-square statistic, with contingency tables and worked examples."
tags: ["nonparametric tests", "chi-square", "goodness of fit", "independence", "contingency table"]
order: 5
---

## Why this lecture matters

Many real problems do not ask about a mean or a variance. They ask whether observed categories follow a proposed distribution, or whether two categorical variables are related. Does the number of defects follow a binomial distribution? Is a car model independent of the owner's gender? Does a website variant change conversion rates? These are **nonparametric** questions: they are about distributions and associations rather than about a single numeric parameter.

The Pearson chi-square test answers them by comparing **observed frequencies** with the frequencies we would expect if the hypothesis were true. At a high level, it measures how far the observed table is from the expected table, scales each discrepancy by the expected count, and adds the contributions. A large total means the data disagree with the hypothesis more than chance alone would explain.

These tests are used in survey analysis, market research, quality control and biostatistics. In computer science they support A/B testing of conversion rates, spam and fraud detection, analysis of confusion matrices, feature selection for categorical variables, fairness audits across demographic groups, and validation of simulated data against real data. In machine learning they help check whether a categorical feature is independent of the target and whether model errors are distributed evenly across groups.

## Tests of goodness of fit

In the first part of this lecture, we test whether observed data are consistent with an assumed distribution for a population feature.

Consider testing a simple null hypothesis against a complex alternative:

$$
H_0:\ F=F_0
\qquad\text{against}\qquad
H_a:\ F\neq F_0.
$$

Split the real line $\mathbb{R}$ into $r$ classes $S_1,\dots,S_r$, i.e. into $r$ pairwise disjoint sets, each with positive probability.

If $n$ observations are made and $H_0$ is true, the expected frequency of observations in class $S_k$ is

$$
E_k=np_k,
\qquad k=1,\dots,r,
$$

where $p_k=P\{X\in S_k\}$ under $F_0$.

Let $(X_1,\dots,X_n)$ be a random sample for $X$, and let $N_1,\dots,N_r$ be the observed sample frequencies for the classes $S_1,\dots,S_r$.

> **Intuition.** Goodness-of-fit testing compares two pictures of the same data: the observed picture given by the counts $N_k$, and the theoretical picture predicted by $F_0$, whose expected counts are $np_k$. If the hypothesised distribution is a good description, these two pictures should look similar up to random fluctuation. The test formalizes how large a discrepancy can still be attributed to chance.

## Pearson's chi-square statistic

As a measure of the difference between the observed frequencies $N_1,\dots,N_r$ and the expected frequencies $np_1,\dots,np_r$, Pearson's chi-square statistic is

$$
\mathcal{X}^2=\sum_{k=1}^{r}\frac{(N_k-np_k)^2}{np_k}.
$$

> **Intuition.** Each term measures how far the observed count $N_k$ is from the count $np_k$ expected under $H_0$, relative to the size of that expected count. Squaring removes the sign, so over-representation and under-representation both count as evidence against $H_0$. If the fitted distribution is correct, all terms should be modest and the total should be small; a large total means the observed and expected counts disagree more than chance would explain.

### Degrees of freedom

When $H_0$ is true, the statistic has approximately a chi-squared distribution with

$$
r-p-1
$$

degrees of freedom, where $p$ is the number of unknown parameters of the hypothesized distribution that are estimated from the sample. We therefore need $r>p+1$.

For example, if the null hypothesis is $N(\mu,\sigma^2)$ and both parameters are unknown, the statistic has approximately a chi-squared distribution with

$$
r-2-1
$$

degrees of freedom.

The unknown parameters are estimated using the methods from the previous lecture. Both the method of moments and maximum likelihood are used, except for the parameter $m$ of the binomial distribution, which is estimated by the method of moments.

> **Intuition.** The degrees of freedom count the independent pieces of information left after fitting. We start with $r$ class counts, but they must add up to $n$, which costs one degree of freedom. Estimating $p$ unknown parameters from the same data costs another $p$ degrees of freedom. Hence the chi-square reference distribution has $r-p-1$ degrees of freedom.

![](/images/lectures/05-stats-non-parameter-tests/image_2.png)

**Note.** In examples with the binomial distribution $B(n,p)$, the letter $n$ denotes the number of trials in each binomial experiment, not the sample size. To avoid confusion, use a different symbol for the sample size when both appear together.

![](/images/lectures/05-stats-non-parameter-tests/image.png)

As an estimator of $\sigma^2$, use the sample variance.

### The critical region

For the chi-square test, the null hypothesis is rejected for large values of the statistic, because large values indicate a poor fit. Thus the critical region is

$$
C=\left(\mathcal{X}^2_{\alpha,\,r-p-1},+\infty\right),
$$

where $\mathcal{X}^2_{\alpha,r-p-1}$ is the upper-tail critical value of the chi-squared distribution.

### Choosing classes

When applying the test, pay attention to the size of the expected frequencies. If an expected frequency is too small, the test statistic may reflect mainly the small expected count rather than a meaningful discrepancy.

> **Intuition.** A class with a tiny expected count can dominate the sum simply because we divide by a tiny number, even though the actual discrepancy is not meaningful. The chi-square approximation also becomes unreliable when counts are sparse. Requiring $np_k\ge 5$ and merging sparse classes keeps each term well behaved and preserves the validity of the reference distribution.

Therefore, every class should have expected frequency at least $5$. Since class sizes need not be equal, if the expected frequency for a class is less than $5$, merge that class with a neighbouring class. The expected and observed frequencies of the new class are obtained by summing the corresponding frequencies of the merged classes. The number of classes $r$ decreases by $1$.

## Worked examples

### Example 1: fair coins

Four coins are tossed $160$ times. The following frequencies of the number of tails were observed:

| $k$ | $0$ | $1$ | $2$ | $3$ | $4$ | Total |
|:---|:---|:---|:---|:---|:---|:---|
| $N_k$ | $6$ | $34$ | $67$ | $41$ | $12$ | $160$ |

Check at the $5\%$ significance level whether these are fair coins.

**Solution.** If the coins are fair and $X$ is the number of tails, then

$$
X\sim B\left(4,\frac{1}{2}\right).
$$

The expected counts are

$$
E_k=160\cdot \binom{4}{k}\left(\frac{1}{2}\right)^4
=10\binom{4}{k},
$$

so

$$
E_0=10,\quad E_1=40,\quad E_2=60,\quad E_3=40,\quad E_4=10.
$$

Each expected count is at least $5$, so no classes need to be merged. The statistic is

$$
\begin{aligned}
\mathcal{X}^2
&=\frac{(6-10)^2}{10}
+\frac{(34-40)^2}{40}
+\frac{(67-60)^2}{60}
+\frac{(41-40)^2}{40}
+\frac{(12-10)^2}{10} \\
&\approx 1.60+0.90+0.82+0.03+0.40 \\
&\approx 3.74.
\end{aligned}
$$

Here $r=5$ and there are no estimated parameters, so the degrees of freedom are $5-0-1=4$. For $\alpha=0.05$,

$$
\mathcal{X}^2_{0.05,4}=9.488.
$$

Since

$$
3.74<9.488,
$$

we do not reject $H_0$. The data are consistent with fair coins.

### Example 2: binomial distribution with unknown $p$

Random samples of $20$ products are taken from a large batch, and the experiment is repeated $100$ times. We want to estimate the probability that a product is defective and check whether the number of defective products has a binomial distribution. The observed frequencies are:

| $k$ | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | Total |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| $N_k$ | $14$ | $25$ | $27$ | $23$ | $7$ | $3$ | $1$ | $100$ |

At the $5\%$ significance level, test whether the number of defective products is binomially distributed.

**Solution.** Model the number of defective products in a sample of $20$ as $B(20,p)$. The total number of observed defective products is

$$
0\cdot14+1\cdot25+2\cdot27+3\cdot23+4\cdot7+5\cdot3+6\cdot1=197.
$$

Since $100$ samples of $20$ products contain $2000$ products in total, the moment estimate of $p$ is

$$
\hat{p}=\frac{197}{2000}=0.0985.
$$

Using this estimate, the expected counts under $B(20,\hat{p})$ are approximately:

| $k$ | $0$ | $1$ | $2$ | $3$ | $\ge 4$ |
|:---|:---|:---|:---|:---|:---|
| $E_k$ | $12.57$ | $27.47$ | $28.51$ | $18.69$ | $12.76$ |

The classes $k=4$, $k=5$, $k=6$ and the unobserved tail $k\ge 7$ were combined into one class $k\ge 4$, because the expected counts for $k=5$, $k=6$ and the tail were below $5$ and those classes could not stand alone. The merged class has observed count $7+3+1=11$. The statistic is

$$
\begin{aligned}
\mathcal{X}^2
&=\frac{(14-12.57)^2}{12.57}
+\frac{(25-27.47)^2}{27.47}
+\frac{(27-28.51)^2}{28.51} \\
&\quad
+\frac{(23-18.69)^2}{18.69}
+\frac{(11-12.76)^2}{12.76} \\
&\approx 0.16+0.22+0.08+0.99+0.24 \\
&\approx 1.70.
\end{aligned}
$$

Now $r=5$ and one parameter $p$ was estimated, so the degrees of freedom are

$$
5-1-1=3.
$$

For $\alpha=0.05$,

$$
\mathcal{X}^2_{0.05,3}=7.815.
$$

Since

$$
1.70<7.815,
$$

we do not reject $H_0$. The binomial model is consistent with the data.

### Example 3: Poisson distribution

The following table shows observed frequencies of the number of machine breakdowns per day in an industrial plant:

| Daily breakdowns $k$ | $\le 5$ | $6$ | $7$ | $8$ | $9$ | $10$ | $11$ | $12$ | $13$ | $14$ | $15$ | $\ge 16$ |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Frequency $N_k$ | $11$ | $13$ | $20$ | $18$ | $27$ | $34$ | $28$ | $12$ | $13$ | $10$ | $7$ | $7$ |

Test the hypothesis that the number of breakdowns per day has a Poisson distribution, i.e.

$$
H_0:\ X\sim P(\lambda).
$$

**Solution outline.** Estimate $\lambda$ from the grouped data (using class midpoints for the open-ended classes), compute the expected probabilities $p_k=P\{X\in S_k\}$ under $P(\hat{\lambda})$, merge classes with expected counts below $5$, and then apply the same procedure as in the previous examples. The degrees of freedom are $r-1-1$, because one parameter $\lambda$ is estimated.

### Example 4: normal distribution

Long-term statistics show that the height of students at a university has a normal distribution with mean $\mu=173$ cm and standard deviation $\sigma=7$ cm. A random sample of $100$ students was taken, with the following class frequencies:

| $S_k$ | $(-\infty,160)$ | $[160,166)$ | $[166,172)$ | $[172,178)$ | $[178,184)$ | $[184,+\infty)$ | Total |
|:---|:---|:---|:---|:---|:---|:---|:---|
| $N_k$ | $5$ | $17$ | $38$ | $25$ | $9$ | $6$ | $100$ |

At the $5\%$ significance level, test whether the distribution is normal with mean $173$ cm and standard deviation $7$ cm.

**Solution.** Because the parameters are specified by $H_0$, they are not estimated from the sample. The expected counts are $E_k=100p_k$, where

$$
p_k=\Phi\left(\frac{b_k-173}{7}\right)-\Phi\left(\frac{a_k-173}{7}\right)
$$

for the class $[a_k,b_k)$.

The first class has expected count below $5$, so merge it with the second class. The resulting expected counts are approximately:

| Class | $(-\infty,166)$ | $[166,172)$ | $[172,178)$ | $[178,184)$ | $[184,+\infty)$ |
|:---|:---|:---|:---|:---|:---|
| $N_k$ | $22$ | $38$ | $25$ | $9$ | $6$ |
| $E_k$ | $15.87$ | $28.45$ | $31.93$ | $17.95$ | $5.80$ |

The statistic is

$$
\begin{aligned}
\mathcal{X}^2
&=\frac{(22-15.87)^2}{15.87}
+\frac{(38-28.45)^2}{28.45}
+\frac{(25-31.93)^2}{31.93} \\
&\quad
+\frac{(9-17.95)^2}{17.95}
+\frac{(6-5.80)^2}{5.80} \\
&\approx 2.37+3.20+1.50+4.46+0.01 \\
&\approx 11.55.
\end{aligned}
$$

Now $r=5$ and no parameters were estimated, so the degrees of freedom are $5-0-1=4$. For $\alpha=0.05$,

$$
\mathcal{X}^2_{0.05,4}=9.488.
$$

Since

$$
11.55>9.488,
$$

we reject $H_0$. At the $5\%$ level, the observed heights are not consistent with the stated normal distribution.

## Testing independence of two categorical features

Pearson's chi-square test is also used to analyse relationships between categorical features.

Often, the $n$ elements of a sample are classified according to two criteria, and we want to know whether the two classifications are independent. For example, we might take a population of engineering graduates and ask whether starting salary is independent of academic discipline.

The same individuals are assigned two qualitative characteristics, $X$ and $Y$. Let the categories of $X$ be $A_1,A_2,\dots,A_r$ and the categories of $Y$ be $B_1,B_2,\dots,B_k$. We test

$$
H_0:\ X \text{ and } Y \text{ are independent},
$$

$$
H_a:\ X \text{ and } Y \text{ are not independent}.
$$

### Contingency tables

If the sample size is $n$, form a table with $r$ rows corresponding to the categories of $X$ and $k$ columns corresponding to the categories of $Y$. In cell $(i,j)$ record the observed frequency $n_{ij}$ of elements in category $A_i$ of $X$ and category $B_j$ of $Y$. Such a table is called a **contingency table**.

![](/images/lectures/05-stats-non-parameter-tests/image_4.png)

The row totals, column totals and grand total are

$$
n_{i.}=\sum_{s=1}^{k}n_{is},
\qquad
n_{.j}=\sum_{t=1}^{r}n_{tj},
\qquad
n=\sum_{i=1}^{r}\sum_{j=1}^{k}n_{ij}.
$$

### The chi-square test for independence

Let $p_{ij}$ be the probability that a randomly chosen element belongs to category $A_i$ of $X$ and category $B_j$ of $Y$, i.e.

$$
p_{ij}=P(A_i\cap B_j).
$$

If $H_0$ is true, then

$$
p_{ij}=P(A_i\cap B_j)=p_{i.}p_{.j},
$$

where $p_{i.}=P(A_i)$ and $p_{.j}=P(B_j)$.

The estimators of $p_{i.}$ and $p_{.j}$ are

$$
\hat{p}_{i.}=\frac{n_{i.}}{n},
\qquad
\hat{p}_{.j}=\frac{n_{.j}}{n}.
$$

Therefore, if $H_0$ is true, the expected frequency in cell $(i,j)$ is

$$
E_{ij}=np_{ij}
=\frac{n_{i.}\cdot n_{.j}}{n}.
$$

> **Intuition.** Under independence, the chance of falling simultaneously into row $i$ and column $j$ is the product of the two marginal chances. The expected cell count is therefore the product of the row total and the column total divided by the grand total: $n\cdot(n_{i.}/n)\cdot(n_{.j}/n)=n_{i.}n_{.j}/n$. Comparing each observed cell count with this product-based expectation is the essence of the independence test.

For large $n$, when $H_0$ is true,

$$
\mathcal{X}^2
=\sum_{i=1}^{r}\sum_{j=1}^{k}\frac{(n_{ij}-E_{ij})^2}{E_{ij}}
=\sum_{i=1}^{r}\sum_{j=1}^{k}
\frac{\left(n_{ij}-\dfrac{n_{i.}n_{.j}}{n}\right)^2}
{\dfrac{n_{i.}n_{.j}}{n}}
$$

has approximately a chi-squared distribution with

$$
(r-1)(k-1)
$$

degrees of freedom.

The null hypothesis is rejected when the calculated statistic exceeds the critical value

$$
\mathcal{X}^2_{\alpha,\,(r-1)(k-1)}.
$$

**Note.** The Pearson test should be used when the expected frequency in every cell of the contingency table is at least $5$. If this condition is not met, other tests are recommended.

### A computational shortcut

The chi-square statistic can be rewritten in a form that is often easier to compute:

$$
\mathcal{X}^2
=n\left(\sum_{i=1}^{r}\sum_{j=1}^{k}
\frac{n_{ij}^2}{n_{i.}n_{.j}}-1\right).
$$

This is algebraically equivalent to the definition above and avoids computing every expected count separately.

### The contingency coefficient

A measure of the degree of association between the features in a contingency table is the **contingency coefficient**

$$
C=\sqrt{\frac{\mathcal{X}^2}{\mathcal{X}^2+n}}.
$$

The larger $C$ is, the stronger the association. The value of $C$ is always less than $1$.

> **Intuition.** The contingency coefficient rescales the chi-square statistic onto a fixed $[0,1)$ scale, so tables of different sizes can be compared more fairly. When $\mathcal{X}^2=0$ there is no association and $C=0$; as $\mathcal{X}^2$ grows, $C$ approaches $1$ but never reaches it. The sample size $n$ appears in the denominator to prevent large samples from automatically producing a coefficient near $1$.

### Example: car model and gender

At significance level $\alpha=0.05$, test the hypothesis that the Peugeot car model does not depend on the owner's gender. The results for $350$ randomly selected car owners are:

| $X\backslash Y$ | Peugeot 106 | Peugeot 206 | Peugeot 306 |
|:---|:---|:---|:---|
| male | $40$ | $80$ | $30$ |
| female | $30$ | $120$ | $50$ |

**Solution.** The row totals are $150$ (male) and $200$ (female), and the column totals are $70$, $200$ and $80$. The grand total is $n=350$.

Under independence, the expected counts are:

| $X\backslash Y$ | Peugeot 106 | Peugeot 206 | Peugeot 306 |
|:---|:---|:---|:---|
| male | $30$ | $85.71$ | $34.29$ |
| female | $40$ | $114.29$ | $45.71$ |

For example,

$$
E_{11}=\frac{150\cdot70}{350}=30.
$$

The statistic is

$$
\begin{aligned}
\mathcal{X}^2
&=\frac{(40-30)^2}{30}
+\frac{(80-85.71)^2}{85.71}
+\frac{(30-34.29)^2}{34.29} \\
&\quad
+\frac{(30-40)^2}{40}
+\frac{(120-114.29)^2}{114.29}
+\frac{(50-45.71)^2}{45.71} \\
&\approx 3.33+0.38+0.54+2.50+0.29+0.40 \\
&\approx 7.44.
\end{aligned}
$$

The degrees of freedom are

$$
(r-1)(k-1)=(2-1)(3-1)=2.
$$

For $\alpha=0.05$,

$$
\mathcal{X}^2_{0.05,2}=5.991.
$$

Since

$$
7.44>5.991,
$$

we reject $H_0$. There is significant evidence that car model and gender are associated. The contingency coefficient is

$$
C=\sqrt{\frac{7.44}{7.44+350}}
\approx \sqrt{0.0208}
\approx 0.14,
$$

which indicates a weak association.
