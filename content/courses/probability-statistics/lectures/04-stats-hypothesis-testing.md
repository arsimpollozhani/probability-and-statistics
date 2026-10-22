---
title: "Hypothesis Testing"
description: "Null and alternative hypotheses, Type I and Type II errors, test statistics, critical regions and p-values, with worked examples for means, variances and two-sample comparisons."
tags: ["hypothesis testing", "p-value", "t-test", "z-test", "chi-square test", "F-test"]
order: 4
---

## Why this lecture matters

Estimation gives a best guess for an unknown parameter, but it does not tell us whether an observed difference is meaningful. Hypothesis testing provides a disciplined way to decide between competing claims using data: is a coin fair, has a new drug reduced blood pressure, is a website version better, or are two variances equal?

At a high level, a hypothesis test asks: *if the default claim were true, how surprising would the observed data be?* If the data are too surprising, we reject the default claim. The price of this decision is controlled by the significance level $\alpha$, which fixes the probability of a false alarm.

Hypothesis testing is everywhere. In medicine it determines whether a treatment works; in industry it supports quality control and A/B testing; in science it decides whether an effect is real. In computer science it is used for benchmarking, performance regression detection, anomaly detection and security experiments. In machine learning it appears in feature selection, comparison of model accuracies, detection of data drift, evaluation of A/B tests and checks of whether a categorical feature is independent of the target.

## Introduction

Point estimation and confidence interval estimation are important components of statistical analysis. In many practical problems, however, we must decide whether to accept or reject a claim about a parameter or a distribution. The procedure for making that decision is called **hypothesis testing**. It is one of the most widely used tools of statistical inference.

**Example 1.** We want to check whether a coin is fair, i.e. whether $p=0.5$ in the binomial distribution. The coin is tossed $n$ times and a sample of outcomes is formed. Based on the results, a statistical test should decide whether the assumption (hypothesis) that the coin is fair is accepted or rejected.

**Example 2.** The average waiting time of customers at a bank used to be $5$ minutes. We want to check whether the average waiting time has decreased since a new counter was introduced. A random sample of customers is selected and their waiting times are recorded. Based on the results, a statistical test should decide whether the assumption that the waiting time has decreased is accepted or rejected.

## Statistical hypotheses

**Definition 1.** Any assumption about a population, about the distribution of one of its features, or about the values of its parameters is called a **statistical hypothesis**.

The procedure by which, based on data from a sample, we check the correctness of a hypothesis is called a **statistical test**.

### Parametric and non-parametric hypotheses

If the functional form of $F(x,\theta)$ is known and only some parameter values are assumed, the hypothesis is **parametric**. In every other case the hypothesis is **non-parametric**.

Examples:

- If $X$ is known to be normally distributed, then "the mean of $X$ is $0$" is a parametric hypothesis about $\mu$ in $N(\mu,\sigma^2)$.
- If $X$ and $Y$ are normally distributed, then "the variances of $X$ and $Y$ are equal" is a parametric hypothesis.
- "The random variable $X$ has a normal distribution" is a non-parametric hypothesis.
- "The random variable $X$ has a Poisson distribution $P(1)$" is a non-parametric hypothesis.
- "The random variables $X$ and $Y$ are independent" is a non-parametric hypothesis.

### Null and alternative hypotheses

In both motivating examples, the testing procedure reduces to deciding between two mutually exclusive hypotheses. If one is accepted, the other is automatically rejected, and vice versa.

For the coin example, one hypothesis is that the coin is fair, i.e. the probability of heads is $1/2$; the other is that this probability differs from $1/2$.

For the bank example, one hypothesis is that the waiting time remains $5$ minutes; the other is that it decreases after the new counter is introduced.

The hypothesis being tested is called the **null hypothesis** and is denoted by $H_0$. The opposite claim is called the **alternative hypothesis** and is denoted by $H_a$ (sometimes $H_1$).

The null hypothesis is usually chosen based on existing standards for the feature or on the values that were current until the latest measurement.

> **Intuition.** The null hypothesis plays the role of the "default" or "no change" claim. It is not automatically assumed to be true; it is the claim we keep unless the sample provides strong evidence against it. The alternative hypothesis contains the kind of departure we are looking for, and its direction determines whether the test is one-sided or two-sided.

For the coin example, if $p$ is the probability of heads, then

$$
H_0:\ p=\frac{1}{2},
\qquad
H_a:\ p\neq\frac{1}{2}.
$$

For the bank example, let $\mu_1$ be the expected waiting time before the new counter and $\mu_2$ the expected waiting time after it. Then

$$
H_0:\ \mu_1=\mu_2,
\qquad
H_a:\ \mu_1>\mu_2.
$$

### Simple and complex hypotheses

From this point on we focus on parametric hypothesis testing.

A hypothesis that specifies exactly one value of the unknown parameter is called a **simple hypothesis**. For example,

$$
H_0:\ p=\frac{1}{2}
$$

is simple.

A hypothesis that allows several values of the parameter is called a **complex hypothesis**. For example,

$$
H_a:\ p\neq\frac{1}{2}
$$

is complex, because it allows every value in $(0,1)$ except $1/2$.

> **Intuition.** A simple hypothesis pins the parameter down to one exact value, so it specifies one fully known distribution. A complex hypothesis leaves a whole set of possible values open. This distinction matters because the probability of a Type I error is easiest to control when the null hypothesis is simple.

### One-sided and two-sided tests

In the coin example,

$$
H_0:\ p=\frac{1}{2},
\qquad
H_a:\ p\neq\frac{1}{2}.
$$

Because the alternative allows values on both sides of $1/2$, this is a **two-sided test**.

In other situations the hypotheses may be

$$
H_0:\ p=\frac{1}{2},
\qquad
H_a:\ p>\frac{1}{2},
$$

or

$$
H_0:\ p=\frac{1}{2},
\qquad
H_a:\ p<\frac{1}{2}.
$$

These are **one-sided tests**.

## Errors in hypothesis testing

Hypothesis testing uses information from a random sample. If the information is consistent with $H_0$, we do not reject $H_0$. If it is inconsistent with $H_0$, we reject $H_0$.

The correctness of a hypothesis can never be known with certainty unless we examine the entire population, which is impossible in most practical situations. Hypothesis tests therefore carry a certain probability of reaching a wrong conclusion.

### Type I and Type II errors

A wrong conclusion is reached if we reject $H_0$ when it is true, or if we fail to reject $H_0$ when it is false. We therefore define two types of errors.

**Definition 2.** The error of rejecting the null hypothesis when it is true is called a **Type I error**. The error of failing to reject the null hypothesis when it is false is called a **Type II error**.

During any hypothesis test, four situations are possible:

| | $H_0$ is true | $H_0$ is false |
|:---|:---|:---|
| The test rejects $H_0$ | **Type I error** | No error |
| The test does not reject $H_0$ | No error | **Type II error** |

Because the decision is based on random variables, we can assign probabilities to these errors. Denote them by $\alpha$ and $\beta$:

$$
\alpha = P(\text{Type I error})
= P(H_0 \text{ is rejected} \mid H_0 \text{ is true}),
$$

$$
\beta = P(\text{Type II error})
= P(H_0 \text{ is not rejected} \mid H_0 \text{ is false}).
$$

The probability of a Type I error is also called the **significance level** of the test.

> **Intuition.** A Type I error is a false alarm: we reject a true null hypothesis. A Type II error is a missed detection: we fail to reject a false null hypothesis. The two errors pull in opposite directions. Making the rejection region smaller reduces false alarms but makes real departures harder to detect, which is why one usually fixes $\alpha$ first and then tries to maximize power.

### Power of a test

The quantity $1-\beta$ is called the **power** of the test. It is the probability of rejecting the null hypothesis when it is false. Power measures the sensitivity of the test, i.e. its ability to detect differences.

We want tests with as small a Type I error and as small a Type II error as possible. However, no test can simultaneously minimize both probabilities. Therefore, when testing hypotheses, the probability of a Type I error (the significance level) is fixed in advance, and then we seek a test with the smallest possible Type II error, i.e. the highest power.

### Example: balls in a box

A box contains $10$ balls, but it is not known whether there are $6$ red and $4$ green balls or $5$ red and $5$ green balls. Define

$$
H_0:\ \text{the box contains 6 red and 4 green balls},
$$

$$
H_a:\ \text{the box contains 5 red and 5 green balls}.
$$

One ball is drawn and the following test rule is used: **do not reject $H_0$ if and only if a red ball is drawn; otherwise reject $H_0$.**

Determine the probabilities of Type I and Type II errors.

**Solution.** Under $H_0$, the probability of drawing a green ball is $4/10$, and this is exactly the probability of rejecting $H_0$ when it is true:

$$
\alpha = P(\text{green}\mid H_0) = \frac{4}{10}=0.4.
$$

Under $H_a$, the probability of drawing a red ball is $5/10$, and this is the probability of failing to reject $H_0$ when it is false:

$$
\beta = P(\text{red}\mid H_a) = \frac{5}{10}=0.5.
$$

Both error probabilities are large, which shows that a single draw gives very little information. A larger sample would be needed for a useful test.

### Choosing the significance level

Most often, $\alpha=0.05$ or $\alpha=0.01$ is chosen.

The value $\alpha$ is the probability of rejecting the null hypothesis when it is true. If the test is repeated many times, then when $H_0$ is true:

- with $\alpha=0.05$, we will reject $H_0$ in about $5\%$ of the repetitions;
- with $\alpha=0.01$, we will reject $H_0$ in about $1\%$ of the repetitions.

## Statistical tests and test statistics

**Definition 3.** Any rule according to which, for each realization $x$ of the random sample $X$, we either reject or do not reject $H_0$ is called a **statistical test**.

Test rules are based on the values of certain statistics defined on the random sample. These are called **test statistics**. The choice of test statistic depends on the hypothesis being tested.

- One usually starts from a parameter estimator with good properties.
- For hypotheses about the mean or variance of a feature, one typically starts from the maximum likelihood estimator or from an estimator obtained by the method of moments.

### The critical region

The step before the final decision is the determination of the **critical region** (or rejection region). The real line is divided into two parts: the region where $H_0$ is not rejected and the region where it is rejected.

Denote the critical region by $C$. It is chosen so that, when $H_0$ is true, the probability that the test statistic falls into $C$ is at most $\alpha$:

$$
P\{Z\in C \mid H_0 \text{ is true}\}\le\alpha.
$$

This probability is the probability of a Type I error.

> **Intuition.** The critical region is the set of test-statistic values that are so extreme under $H_0$ that observing them would be surprising. Its size is controlled by $\alpha$: only the most extreme $100\alpha\%$ of the null distribution is marked as rejection territory. The data then decide the issue by landing either inside or outside that territory.

### The most powerful critical region

For a fixed Type I error probability $\alpha$, we would like to minimize the Type II error probability $\beta$. A critical region that achieves this is called the **most powerful critical region**.

If $C^*$ is the most powerful critical region, then for every other critical region $C$,

$$
P\{Z\notin C^* \mid H_a \text{ is true}\}
\le
P\{Z\notin C \mid H_a \text{ is true}\}.
$$

Here $P\{Z\notin C \mid H_a \text{ is true}\}$ is the probability of a Type II error. Thus, the most powerful critical region minimizes the Type II error probability.

There are methods for finding the most powerful critical region, but they are beyond the scope of this lecture.

## Making a decision

In the final step, the value of the test statistic is calculated from the sample and compared with the critical region $C$.

- If the value belongs to $C$, we reject $H_0$.
- If the value does not belong to $C$, we do not reject $H_0$ (we say the data are consistent with $H_0$).

If the sample leads to rejection of $H_0$, we say that the difference between the data and $H_0$ is **statistically significant**, or that the test is significant. If $H_0$ is not rejected, we say that the data do not provide sufficient evidence against $H_0$, or that the test is not significant.

Note carefully that "not rejecting $H_0$" is not the same as "proving $H_0$". It only means that the data are compatible with $H_0$. Also, the sets of parameter values in $H_0$ and $H_a$ must be disjoint, so that rejecting one hypothesis implies accepting the other.

If the alternative hypothesis remains the same and the null hypothesis becomes complex (for example, $H_0:\mu\le\mu_0$ instead of $H_0:\mu=\mu_0$), the critical region does not change.

### The hypothesis-testing algorithm

1. From the context of the problem, identify the parameter of interest.
2. Define the null hypothesis $H_0$ and the alternative hypothesis $H_a$.
3. Choose the significance level $\alpha$.
4. Select an appropriate test statistic.
5. Determine the critical region $C$ for that statistic.
6. Calculate the value of the test statistic from the sample.
7. Check whether the calculated value belongs to $C$.
8. If it does, reject $H_0$; otherwise, do not reject $H_0$.

## Tests for one feature

### Tests for the mean

Let $(X_1,\dots,X_n)$ be a random sample of a variable $X$ whose mean is unknown. We consider tests for the mean in two situations:

- $X$ has a **normal distribution**, with an arbitrary sample size;
- $X$ does **not** have a normal distribution, but the sample size is **large** ($n\ge 30$).

Let the significance level be $\alpha$. For a normal variable $X\sim N(\mu,\sigma^2)$, we consider the following cases:

1. $\sigma^2$ is known, sample size arbitrary;
2. $\sigma^2$ is unknown:
   - small sample;
   - large sample.

#### Known variance

Let $X\sim N(\mu,\sigma^2)$ with $\sigma^2$ known. Test

$$
H_0:\ \mu=\mu_0
\qquad\text{against}\qquad
H_a:\ \mu\neq\mu_0.
$$

This is a two-sided test.

To choose the test statistic, start from the estimator of $\mu$ obtained by maximum likelihood, namely the sample mean $\hat{\mu}=\overline{X}_n$. When $\sigma^2$ is known,

$$
\overline{X}_n\sim N\left(\mu,\frac{\sigma^2}{n}\right).
$$

Under $H_0$, the statistic

$$
Z_0 = \frac{\overline{X}_n-\mu_0}{\sigma/\sqrt{n}}
= \frac{\overline{X}_n-\mu_0}{\sigma}\sqrt{n}
$$

has the standard normal distribution $Z_0\sim N(0,1)$.

The critical region is chosen so that

$$
P\{Z_0\in C\mid H_0 \text{ is true}\}=\alpha,
$$

and for the two-sided alternative it has the form

$$
C=(-\infty,-z_{\alpha/2})\cup(z_{\alpha/2},+\infty),
$$

where $z_{\alpha/2}$ is obtained from the standard normal table by

$$
\Phi(z_{\alpha/2})=1-\frac{\alpha}{2}.
$$

![](/images/lectures/04-stats-hypothesis-testing/image.png)

Why are both tails used? The statistic

$$
Z_0=\frac{\overline{X}_n-\mu_0}{\sigma}\sqrt{n}
$$

measures the difference between the observed mean $\overline{X}_n$ and the hypothesized mean $\mu_0$. The difference is large when $Z_0$ is far from $0$ in either direction. Since

$$
H_a:\ \mu\neq\mu_0
$$

allows values on both sides of $\mu_0$, we reject for values on both sides of $0$.

#### Example: blood pressure

Blood pressure in men aged $35$ to $44$ is known to have a normal distribution with mean $127$ and standard deviation $7$. During a systematic review of $70$ randomly selected employees of a company, the average blood pressure was found to be $125$. At significance level $\alpha=0.05$, can we conclude that the expected blood pressure of the company's employees deviates from the standard?

**Solution.** We test

$$
H_0:\ \mu=127
\qquad\text{against}\qquad
H_a:\ \mu\neq127.
$$

The test statistic is

$$
z_0=\frac{\overline{x}-\mu_0}{\sigma/\sqrt{n}}
=\frac{125-127}{7/\sqrt{70}}
\approx -2.39.
$$

For $\alpha=0.05$, the two-sided critical values are $\pm z_{0.025}=\pm 1.96$. Since

$$
|-2.39|>1.96,
$$

we reject $H_0$. There is significant evidence that the average blood pressure of the company's employees differs from the standard $127$.

#### One-sided tests

For the one-sided alternatives

$$
H_0:\ \mu=\mu_0,\quad H_a:\ \mu>\mu_0
$$

and

$$
H_0:\ \mu=\mu_0,\quad H_a:\ \mu<\mu_0,
$$

the same statistic $Z_0$ is used, but the critical region changes.

For $H_a:\mu>\mu_0$,

$$
C=(z_\alpha,+\infty).
$$

For $H_a:\mu<\mu_0$,

$$
C=(-\infty,-z_\alpha).
$$

Here $z_\alpha$ is the value from the standard normal distribution for which

$$
\Phi(z_\alpha)=1-\alpha.
$$

![](/images/lectures/04-stats-hypothesis-testing/image_2.png)

#### Unknown variance, small sample

Let $X\sim N(\mu,\sigma^2)$ with $\sigma^2$ unknown and a small sample. Test

$$
H_0:\ \mu=\mu_0
$$

against one of the alternatives

$$
H_a:\ \mu\neq\mu_0,
\qquad
H_a:\ \mu>\mu_0,
\qquad
H_a:\ \mu<\mu_0.
$$

As before, start from the sample mean $\hat{\mu}=\overline{X}_n$.

When $\sigma^2$ is unknown and the sample is small, under $H_0$ the statistic

$$
T_0=\frac{\overline{X}_n-\mu_0}{S/\sqrt{n}}
=\frac{\overline{X}_n-\mu_0}{S}\sqrt{n}
$$

has a Student $t$-distribution with $n-1$ degrees of freedom, where $S^2$ is the sample variance.

The critical region depends on the alternative.

- For $H_a:\mu\neq\mu_0$,

$$
C=(-\infty,-t_{\alpha/2,n-1})\cup(t_{\alpha/2,n-1},+\infty),
$$

where

$$
P\{T>t_{\alpha/2,n-1}\}=\frac{\alpha}{2}.
$$

- For $H_a:\mu>\mu_0$,

$$
C=(t_{\alpha,n-1},+\infty),
$$

where

$$
P\{T>t_{\alpha,n-1}\}=\alpha.
$$

- For $H_a:\mu<\mu_0$,

$$
C=(-\infty,-t_{\alpha,n-1}),
$$

where again

$$
P\{T>t_{\alpha,n-1}\}=\alpha.
$$

![](/images/lectures/04-stats-hypothesis-testing/image_3.png)

> **Intuition.** When $\sigma$ is unknown, the test statistic uses $S$ instead. This replacement costs one degree of freedom, so the $t$-distribution with $n-1$ degrees of freedom is used instead of the standard normal. For small samples the heavier $t$ tails make the critical values larger, which protects against overconfident conclusions. For large samples the difference becomes negligible.

#### Example: fuel consumption

The fuel consumption of Peugeot cars is known to have a normal distribution with mean $8$ litres per $100$ km. From a manufactured series, $17$ cars were randomly selected and an average consumption of $8.8$ litres per $100$ km with a standard deviation of $0.9$ was obtained. At significance level $\alpha=0.05$, can we argue that this series has a higher consumption than predicted?

**Solution.** We test

$$
H_0:\ \mu=8
\qquad\text{against}\qquad
H_a:\ \mu>8.
$$

The test statistic is

$$
t_0=\frac{\overline{x}-\mu_0}{s/\sqrt{n}}
=\frac{8.8-8}{0.9/\sqrt{17}}
\approx 3.66.
$$

For $\alpha=0.05$ and $n-1=16$ degrees of freedom, the one-sided critical value is

$$
t_{0.05,16}=1.746.
$$

Since

$$
3.66>1.746,
$$

we reject $H_0$. There is significant evidence that the series has higher fuel consumption than the predicted $8$ litres per $100$ km.

#### Unknown variance, large sample

Let $X\sim N(\mu,\sigma^2)$ with $\sigma^2$ unknown and a large sample. When $n\ge 30$, replacing $\sigma$ by the sample standard deviation $S$ has little effect on the distribution of the statistic. Therefore, we may approximate the $T$ statistic by the $Z$ statistic:

$$
T_0=\frac{\overline{X}_n-\mu_0}{S/\sqrt{n}}\approx Z_0,
$$

and use the corresponding $z$-tests.

#### Arbitrary distribution, large sample

Often we cannot assume that the variable is normally distributed. When the sample is large ($n\ge 30$), the central limit theorem allows us to use $Z$-statistics to test hypotheses about the mean.

If the variance is known, use

$$
Z_0=\frac{\overline{X}_n-\mu_0}{\sigma/\sqrt{n}}.
$$

If the variance is unknown, use

$$
Z_0=\frac{\overline{X}_n-\mu_0}{S/\sqrt{n}}.
$$

In both cases, when $H_0$ is true, $Z_0$ has approximately the standard normal distribution,

$$
Z_0\sim N(0,1).
$$

#### Example: antibiotic potency

A drug factory produces antibiotics, and the expected potency of one of them is $80\%$. A random sample of $100$ capsules was tested, giving an average potency of $79.7\%$ and a standard deviation of $2\%$. Are the antibiotics produced according to the prescribed standards? Use $\alpha=0.01$.

**Solution.** We test

$$
H_0:\ \mu=80
\qquad\text{against}\qquad
H_a:\ \mu\neq80.
$$

With a large sample, use the $Z$-statistic:

$$
z_0=\frac{\overline{x}-\mu_0}{s/\sqrt{n}}
=\frac{79.7-80}{2/\sqrt{100}}
=\frac{-0.3}{0.2}
=-1.5.
$$

For $\alpha=0.01$, the two-sided critical values are $\pm z_{0.005}=\pm 2.576$. Since

$$
|-1.5|<2.576,
$$

we do not reject $H_0$. At the $1\%$ significance level, the data are consistent with the prescribed mean potency of $80\%$.

### The p-value

One way to report a hypothesis test is to state whether $H_0$ is rejected at a predefined significance level $\alpha$. For example, we might say that $H_0:\mu=50$ is rejected at the $0.05$ level. This is often insufficient, because it does not indicate whether the test statistic is just inside the critical region or far beyond it.

To convey more information, we report the **p-value**.

**Definition 4.** The **p-value** is the smallest significance level that would lead to rejection of $H_0$ with the given data.

Decision rule:

- if $p\le\alpha$, reject $H_0$;
- if $p>\alpha$, do not reject $H_0$.

The p-value measures the strength of evidence against $H_0$: a small p-value means the observed data would be unusual if $H_0$ were true.

> **Intuition.** The $p$-value answers: "If $H_0$ were true, how often would I see data at least as extreme as mine?" A small $p$-value means the observed data would be unusual under $H_0$, so the evidence against $H_0$ is strong. A large $p$-value means the data are unremarkable under $H_0$, so there is no reason to abandon it. The $p$-value is **not** the probability that $H_0$ is true.

#### Example: p-value for antibiotic potency

Consider the antibiotic example with $\alpha=0.05$. The observed statistic is $z_0=-1.5$. For a two-sided test, the p-value is

$$
p = 2P\{Z>|z_0|\}
= 2P\{Z>1.5\}
= 2(1-\Phi(1.5))
\approx 2(1-0.9332)
= 0.1336.
$$

Since

$$
p=0.1336>0.05,
$$

we do not reject $H_0$ at the $5\%$ level. The data are consistent with the prescribed potency.

### Tests for a variance

Let $X\sim N(\mu,\sigma^2)$, with both $\mu$ and $\sigma$ unknown. Test

$$
H_0:\ \sigma^2=\sigma_0^2
$$

against one of the alternatives

$$
H_a:\ \sigma^2\neq\sigma_0^2,
\qquad
H_a:\ \sigma^2>\sigma_0^2,
\qquad
H_a:\ \sigma^2<\sigma_0^2.
$$

The test statistic is

$$
\chi_0^2=\frac{(n-1)S^2}{\sigma_0^2}.
$$

Under $H_0$, it has a chi-squared distribution with $n-1$ degrees of freedom.

The critical region depends on the alternative:

- for $H_a:\sigma^2\neq\sigma_0^2$,

$$
C=\left(0,\chi^2_{1-\alpha/2,\,n-1}\right)\cup\left(\chi^2_{\alpha/2,\,n-1},+\infty\right);
$$

- for $H_a:\sigma^2>\sigma_0^2$,

$$
C=\left(\chi^2_{\alpha,\,n-1},+\infty\right);
$$

- for $H_a:\sigma^2<\sigma_0^2$,

$$
C=\left(0,\chi^2_{1-\alpha,\,n-1}\right).
$$

![](/images/lectures/04-stats-hypothesis-testing/image_5.png)

> **Intuition.** A test about a variance is naturally based on the sample variance $S^2$, scaled by the hypothesized variance $\sigma_0^2$. The statistic $\chi_0^2=(n-1)S^2/\sigma_0^2$ is close to $n-1$ when $H_0$ is true, too small when the true variance is smaller, and too large when the true variance is larger. Because the chi-squared distribution is skewed, the two tails are handled separately.

#### Example: variance of a feature

From a random sample of size $n=25$ for a normally distributed feature $X$, a sample variance of $22$ was obtained. At significance level $\alpha=0.05$, can we conclude that the population variance is greater than $15$?

**Solution.** We test

$$
H_0:\ \sigma^2=15
\qquad\text{against}\qquad
H_a:\ \sigma^2>15.
$$

The test statistic is

$$
\chi_0^2=\frac{(n-1)s^2}{\sigma_0^2}
=\frac{24\cdot 22}{15}
=35.2.
$$

For $\alpha=0.05$ and $24$ degrees of freedom, the critical value is

$$
\chi^2_{0.05,24}=36.415.
$$

Since

$$
35.2<36.415,
$$

we do not reject $H_0$. There is not enough evidence at the $5\%$ level to conclude that the variance exceeds $15$.

## Tests for two features

### Comparing two variances

Let $X$ and $Y$ be variables from two independent populations with distributions

$$
X\sim N(\mu_X,\sigma_X^2),
\qquad
Y\sim N(\mu_Y,\sigma_Y^2),
$$

where all parameters are unknown. Based on independent random samples of sizes $n$ and $m$, test

$$
H_0:\ \sigma_X^2=\sigma_Y^2
$$

against one of the alternatives

$$
H_a:\ \sigma_X^2\neq\sigma_Y^2,
\qquad
H_a:\ \sigma_X^2>\sigma_Y^2,
\qquad
H_a:\ \sigma_X^2<\sigma_Y^2.
$$

Let

$$
X=(X_1,\dots,X_n),
\qquad
Y=(Y_1,\dots,Y_m)
$$

be the two samples, and let $S_X^2$ and $S_Y^2$ be the corresponding sample variances.

The statistic

$$
F=\frac{S_X^2}{S_Y^2}
$$

has a Fisher $F_{n-1,m-1}$ distribution, with $n-1$ numerator degrees of freedom and $m-1$ denominator degrees of freedom. When $H_0$ is true, it follows this distribution, and the critical regions are defined from it.

- For $H_a:\sigma_X^2\neq\sigma_Y^2$,

$$
C=\left(0,f_{1-\alpha/2,\,n-1,\,m-1}\right)
\cup
\left(f_{\alpha/2,\,n-1,\,m-1},+\infty\right).
$$

- For $H_a:\sigma_X^2>\sigma_Y^2$,

$$
C=\left(f_{\alpha,\,n-1,\,m-1},+\infty\right).
$$

- For $H_a:\sigma_X^2<\sigma_Y^2$,

$$
C=\left(0,f_{1-\alpha,\,n-1,\,m-1}\right).
$$

![](/images/lectures/04-stats-hypothesis-testing/image_6.png)

> **Intuition.** Comparing two variances is naturally done through their ratio. If the null hypothesis $\sigma_X^2=\sigma_Y^2$ holds, the ratio $S_X^2/S_Y^2$ should be around $1$; values far from $1$ in either direction suggest unequal variances. The $F$-distribution tells us how far from $1$ the ratio can drift by chance alone, given the two sample sizes.

A practical problem is that $F$-tables exist only for a few (mainly small) values of $\alpha$. Therefore, when the alternative is

$$
H_a:\ \sigma_X^2\neq\sigma_Y^2
\qquad\text{or}\qquad
H_a:\ \sigma_X^2<\sigma_Y^2,
$$

the lower critical value cannot always be read directly. Use the reciprocal identity

$$
f_{1-\alpha,\,m,\,n}=\frac{1}{f_{\alpha,\,n,\,m}}.
$$

#### Example: blood glucose test strips

One measure of the quality of blood glucose test strips is the consistency of results on the same blood sample. Consistency is measured by the variance of readings in repeated testing. Two types of strips, A and B, are compared.

For type A, $16$ strips were tested with drops from one well-mixed tube, giving

$$
s_A^2=2.09.
$$

For type B, $21$ strips were tested with drops from the same tube, giving

$$
s_B^2=1.1.
$$

Assume both samples come from normal populations. At significance level $0.1$, test whether the consistency of the two strip types is equal.

**Solution.** We test

$$
H_0:\ \sigma_A^2=\sigma_B^2
\qquad\text{against}\qquad
H_a:\ \sigma_A^2\neq\sigma_B^2.
$$

The test statistic is

$$
F=\frac{s_A^2}{s_B^2}
=\frac{2.09}{1.1}
\approx 1.90.
$$

The degrees of freedom are $16-1=15$ for the numerator and $21-1=20$ for the denominator. For a two-sided test at $\alpha=0.1$, use the upper critical value

$$
f_{0.05,15,20}\approx 2.20.
$$

Since

$$
1.90<2.20,
$$

we do not reject $H_0$. There is no significant evidence at the $10\%$ level that the two strip types have different variances.

### Comparing two means

Let

$$
X=(X_1,\dots,X_n),
\qquad
Y=(Y_1,\dots,Y_m)
$$

be independent random samples from two populations, with unknown means $\mu_X$ and $\mu_Y$. Test

$$
H_0:\ \mu_X=\mu_Y
$$

against one of the alternatives

$$
H_a:\ \mu_X\neq\mu_Y,
\qquad
H_a:\ \mu_X>\mu_Y,
\qquad
H_a:\ \mu_X<\mu_Y.
$$

We distinguish two main cases:

- small samples from normal distributions, with known or unknown standard deviations;
- large samples, with unknown standard deviations.

#### Known variances

Let $X\sim N(\mu_X,\sigma_X^2)$ and $Y\sim N(\mu_Y,\sigma_Y^2)$, with $\sigma_X^2$ and $\sigma_Y^2$ known. The test statistic is

$$
Z_0=\frac{\overline{X}-\overline{Y}-(\mu_X-\mu_Y)}
{\sqrt{\sigma_X^2/n+\sigma_Y^2/m}}.
$$

Under $H_0:\mu_X=\mu_Y$, this becomes

$$
Z_0=\frac{\overline{X}-\overline{Y}}
{\sqrt{\sigma_X^2/n+\sigma_Y^2/m}},
$$

which has the standard normal distribution $N(0,1)$. The critical region is obtained from the standard normal table and depends on the alternative hypothesis.

#### Unknown but equal variances: pooled t-test

Assume

$$
\sigma_X^2=\sigma_Y^2=\sigma^2.
$$

Estimate the common variance by the **pooled sample variance**

$$
S_p^2=\frac{(n-1)S_X^2+(m-1)S_Y^2}{n+m-2}.
$$

Then the test statistic is

$$
T_0=\frac{\overline{X}-\overline{Y}}{S_p\sqrt{1/n+1/m}}.
$$

When $H_0$ is true, $T_0$ has a Student $t$-distribution with $n+m-2$ degrees of freedom. The critical regions are the usual $t$-critical regions, with $n+m-2$ degrees of freedom.

This test assumes equal variances. Since the variances are unknown, the question arises of how to know whether they are equal. In practice, one first tests equality of variances. If that test does not reject, the pooled $t$-test may be used; otherwise, a test that does not assume equal variances is preferable.

**Note.** If $n+m-2$ is large and the exact degrees of freedom are not available in the table, use the normal approximation

$$
t_{\alpha,\,n+m-2}\approx z_\alpha.
$$

> **Intuition.** The statistic for comparing two means is again a standardized difference. The numerator measures how far apart the two sample means are; the denominator measures how much that difference would vary from sample to sample. If the difference is large relative to its natural variability, the null hypothesis of equal means becomes implausible. The pooled variance $S_p^2$ is a weighted average of the two sample variances, used when we are willing to assume a common underlying variance.

#### Large samples

For large samples ($m,n\ge 30$), the $Z$-statistic is used. Its form depends on whether the variances are known.

If the variances are known,

$$
Z_0=\frac{\overline{X}-\overline{Y}}
{\sqrt{\sigma_X^2/n+\sigma_Y^2/m}}.
$$

If the variances are unknown,

$$
Z_0=\frac{\overline{X}-\overline{Y}}
{\sqrt{S_X^2/n+S_Y^2/m}}.
$$

In both cases, when $H_0$ is true, $Z_0$ has approximately the standard normal distribution, so the usual $z$-critical regions are used.

#### Example: chip manufacturing time

The time needed to manufacture chips using one process was measured, giving

$$
53,\ 119,\ 104,\ 137,\ 119,\ 117,\ 104,\ 73,\ 53,\ 69,\ 119.
$$

For a second process, $13$ measurements were taken. The observed times have mean $56$ and variance $640.3$. Assume the manufacturing times are normally distributed. At the $5\%$ significance level, test whether the second process is faster than the first.

**Solution.** Let process 1 have mean $\mu_1$ and process 2 have mean $\mu_2$. "The second process is faster" means $\mu_2<\mu_1$, so

$$
H_0:\ \mu_1=\mu_2
\qquad\text{against}\qquad
H_a:\ \mu_1>\mu_2.
$$

Assuming the two processes have equal variances, we use the pooled $t$-test. For the first sample, $n=11$,

$$
\overline{x}_1=\frac{1067}{11}=97,
\qquad
s_1^2=\frac{8782}{10}=878.2.
$$

For the second sample, $m=13$,

$$
\overline{x}_2=56,
\qquad
s_2^2=640.3.
$$

The pooled variance is

$$
s_p^2=\frac{10\cdot 878.2+12\cdot 640.3}{11+13-2}
=\frac{16465.6}{22}
\approx 748.44,
$$

so $s_p\approx 27.36$. The test statistic is

$$
t_0=\frac{97-56}{27.36\sqrt{1/11+1/13}}
\approx \frac{41}{11.21}
\approx 3.66.
$$

For a one-sided test at $\alpha=0.05$ with $n+m-2=22$ degrees of freedom,

$$
t_{0.05,22}=1.717.
$$

Since

$$
3.66>1.717,
$$

we reject $H_0$. There is significant evidence that the second process is faster.

#### Example: IT salaries

A sample of $50$ IT engineers had an average salary of $62{,}570$ denars with a standard deviation of $7{,}500$ denars. At significance level $0.05$, test the hypothesis that the average salary is at least $61{,}500$ denars against the alternative that it is less than $61{,}500$ denars.

**Solution.** We test

$$
H_0:\ \mu\ge 61500
\qquad\text{against}\qquad
H_a:\ \mu<61500.
$$

With a large sample, the test statistic is

$$
z_0=\frac{\overline{x}-\mu_0}{s/\sqrt{n}}
=\frac{62570-61500}{7500/\sqrt{50}}
\approx \frac{1070}{1060.66}
\approx 1.01.
$$

For a one-sided test at $\alpha=0.05$, the critical region is

$$
C=(-\infty,-z_{0.05})=(-\infty,-1.645).
$$

Since

$$
1.01>-1.645,
$$

we do not reject $H_0$. The data do not provide sufficient evidence that the average salary is below $61{,}500$ denars.

![Summary of critical regions for tests about a mean](/images/lectures/04-stats-hypothesis-testing/image_7.png)
