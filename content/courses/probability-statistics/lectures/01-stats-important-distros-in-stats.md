---
title: "Important Distributions in Statistics"
description: "The normal, chi-squared, Student t and Fisher F distributions: definitions, intuition, tables and worked readings."
tags: ["distributions", "normal", "chi-square", "t-distribution", "F-distribution"]
order: 1
---

## Why this lecture matters

Test python code:
```python
bikes = pd.read_csv(DATA / "bike-hours.csv")
population = bikes["rentals"].to_numpy()
mu, sigma = population.mean(), population.std()
len(population), round(mu, 1), round(sigma, 1)
```

Almost every statistical procedure asks a question about a quantity we cannot observe directly: the true mean, the true variance, or the difference between two groups. To answer such questions we need probability models for the quantities we **can** compute from data. Four distributions provide most of that machinery:

- the **normal distribution** describes averages and measurement errors;
- the **chi-squared distribution** describes sums of squared errors and is the basis for variance tests and contingency tables;
- the **Student $t$-distribution** handles averages when the population spread is unknown and the sample is small;
- the **Fisher $F$-distribution** compares two estimated variances and underlies ANOVA and regression tests.

At a high level, these distributions turn "is the observed difference real or just noise?" into a precise probability question. Mastering their tables and transformations is therefore a prerequisite for confidence intervals, hypothesis tests, A/B testing, regression diagnostics and model comparison.

In real life and in computing, the same tools appear everywhere: the normal model is used for sensor noise and measurement uncertainty; the $t$-test compares two versions of a website or two machine-learning models trained on small samples; chi-squared tests check whether a categorical feature is independent of a label; and $F$-tests compare nested regression models or the variability of two processes. In machine learning they also show up in feature selection, model calibration checks, experiment analysis and the construction of confidence intervals around evaluation metrics.

## The four distributions at a glance

| Distribution | Typical use | Parameters |
| --- | --- | --- |
| Normal $N(\mu,\sigma^2)$ | Inference about a mean when $\sigma$ is known; measurement error | mean $\mu$, variance $\sigma^2$ |
| Chi-squared $\chi^2_\nu$ | Inference about a variance; goodness of fit; independence | degrees of freedom $\nu$ |
| Student $t_\nu$ | Inference about a mean when $\sigma$ is unknown | degrees of freedom $\nu$ |
| Fisher $F_{\nu_1,\nu_2}$ | Comparing two variances; ANOVA | numerator and denominator degrees of freedom |

> **Intuition.** These four distributions form a toolkit. The normal distribution describes a single average or measurement error; the chi-squared distribution describes accumulated squared error; the $t$-distribution corrects the normal when the spread is estimated from a small sample; and the $F$-distribution compares two estimated spreads. Most classical statistical tests are built from exactly these ingredients.

## Normal distribution

A random variable $X$ has a **normal distribution** with parameters $\mu$ and $\sigma^2$, written

$$
X \sim N(\mu, \sigma^2),
$$

if its probability density function is

$$
p(x) = \frac{1}{\sqrt{2\pi \sigma^2}}\, e^{-\frac{(x-\mu)^2}{2\sigma^2}}.
$$

Here,

- $\mu = E[X]$ is the mathematical expectation;
- $\sigma^2 = D[X]$ is the variance of $X$.

The density is a symmetric bell curve centred at $\mu$. Its spread is controlled by $\sigma$: a larger $\sigma$ makes the curve wider and flatter, while a smaller $\sigma$ makes it narrower and taller.

For any normal distribution, the areas under the density curve obey the **empirical rule**:

- about $68.3\%$ of the area lies within $(\mu-\sigma,\ \mu+\sigma)$;
- about $95.4\%$ of the area lies within $(\mu-2\sigma,\ \mu+2\sigma)$;
- about $99.7\%$ of the area lies within $(\mu-3\sigma,\ \mu+3\sigma)$.

The area outside $(\mu-4\sigma,\ \mu+4\sigma)$ is practically zero. The curve itself extends to infinity, but beyond four standard deviations it is so close to the horizontal axis that the area there is negligible.

> **Intuition.** The parameter $\mu$ only slides the bell curve left or right, while $\sigma$ only stretches or squeezes it. The numbers $68.3\%$, $95.4\%$ and $99.7\%$ say that almost all probability is concentrated within a few standard deviations of the mean. This is why a value lying more than three or four standard deviations away is often treated as unusual.

![Normal distribution](/images/lectures/01-stats-important-distros-in-stats/normal-d.png)

### Standard normal tables

For the **standard normal distribution** $Z \sim N(0,1)$, tables list values of the distribution function

$$
\Phi(a) = P\{Z < a\},
$$

which is the area under the density curve from $-\infty$ to $a$.

Since $\mu=0$ and $\sigma=1$ for the standard normal distribution, the area outside $(-4,4)$ is practically zero. Therefore, if $a \le -4$ then $\Phi(a) = 0$, and if $a \ge 4$ then $\Phi(a) = 1$. Most tables cover $a \in (-4,4)$.

The standard normal density is symmetric, so

$$
\Phi(-a) = 1 - \Phi(a).
$$

This identity lets us read negative values from a table that lists only positive ones.

![](/images/lectures/01-stats-important-distros-in-stats/phi.png)

For example, reading directly from the tables gives

$$
P\{Z < 1.48\} = 0.93056
$$

and

$$
P\{Z < -2.65\} = 0.00402.
$$

### Standardizing a normal variable

If $X \sim N(\mu,\sigma^2)$ and we need a probability involving $X$, we first transform $X$ into a standard normal variable:

$$
Z = \frac{X-\mu}{\sigma}.
$$

Subtracting $\mu$ moves the centre to $0$, and dividing by $\sigma$ rescales the horizontal axis so that one unit means one standard deviation. After this change of units, the same standard normal table works for every normal distribution.

For a given value $x_0$, the quantity

$$
z_0 = \frac{x_0-\mu}{\sigma}
$$

tells us how many standard deviations $x_0$ lies from the mean $\mu$.

For example, if $X$ has mean $100$ and standard deviation $50$, then for $x=200$,

$$
z = \frac{x-\mu}{\sigma} = \frac{200-100}{50} = 2.0.
$$

So $x=200$ is two standard deviations above the mean.

> **Intuition.** Standardization turns a question about an arbitrary normal variable into a question about one fixed curve, the standard normal curve. The same tables then apply to every normal distribution.

### Calculating normal probabilities

Let $X \sim N(\mu,\sigma^2)$. To calculate $P\{a < X < b\}$, standardize all three parts of the inequality and then read the standard normal table:

$$
\begin{aligned}
P\{a < X < b\}
&= P\left\{\frac{a-\mu}{\sigma} < \frac{X-\mu}{\sigma} < \frac{b-\mu}{\sigma}\right\} \\
&= P\left\{\frac{a-\mu}{\sigma} < Z < \frac{b-\mu}{\sigma}\right\} \\
&= F_Z\left(\frac{b-\mu}{\sigma}\right) - F_Z\left(\frac{a-\mu}{\sigma}\right) \\
&= \Phi\left(\frac{b-\mu}{\sigma}\right) - \Phi\left(\frac{a-\mu}{\sigma}\right).
\end{aligned}
$$

The two values $\Phi\left(\frac{b-\mu}{\sigma}\right)$ and $\Phi\left(\frac{a-\mu}{\sigma}\right)$ are then read from the standard normal table.

![](/images/lectures/01-stats-important-distros-in-stats/phib-phia.png)

#### Worked example

Let $X \sim N(8,25)$ and determine $P\{X < 8.6\}$.

Here $\mu=8$ and $\sigma=\sqrt{25}=5$. Standardizing gives

$$
P\{X < 8.6\}
= P\left\{\frac{X-\mu}{\sigma} < \frac{8.6-8.0}{5.0}\right\}
= P\{Z < 0.12\}
= \Phi(0.12)
= 0.54776.
$$

![](/images/lectures/01-stats-important-distros-in-stats/image.png)

### Finding a $z$-value from a probability

How do we find the value $z$ for which $\Phi(z)=0.2$ when $Z \sim N(0,1)$?

Look in the body of the $\Phi$ table for the value $0.2$ (or the closest value to it), and then read the corresponding row and column to obtain $z$. From the table,

$$
z = -0.84.
$$

So $20\%$ of the area lies to the left of $z=-0.84$.

![$20\%$ of the area is before $z=-0.84$](/images/lectures/01-stats-important-distros-in-stats/image_2.png)

![Reading $z=-0.84$ from the standard normal table](/images/lectures/01-stats-important-distros-in-stats/image_3.png)

## Chi-squared distribution

**Definition 1.** Let $X_1, X_2, \dots, X_n$ be independent random variables with the standard normal distribution $N(0,1)$. Then the random variable

$$
\boxed{Y = X_1^2 + X_2^2 + \cdots + X_n^2}
$$

has a **chi-squared distribution** with **$n$ degrees of freedom**, written

$$
Y \sim \chi^2_n.
$$

In particular, if $n=1$ and $X \sim N(0,1)$, then $Y=X^2 \sim \chi^2_1$.

Each standard normal variable contributes one squared deviation, and the chi-squared variable is the total of those squared deviations. The degrees of freedom count how many independent squared deviations were added. Because squares cannot be negative, the chi-squared distribution lives only on $(0,+\infty)$ and is skewed to the right. Adding more terms makes it wider and pushes its peak to the right.

> **Intuition.** The chi-squared distribution measures accumulated squared error. A small value means the observed quantities are close to what the model predicts; a large value means the squared errors are unusually large.

### Mean and variance

For a chi-squared distribution with $n$ degrees of freedom,

$$
E[\chi^2_n] = \frac{n}{2}\cdot 2 = n
$$

and

$$
D[\chi^2_n] = \frac{n}{2}\cdot 2^2 = 2n.
$$

If $X \sim N(\mu,\sigma^2)$, then

$$
Z = \frac{X-\mu}{\sigma} \sim N(0,1),
$$

and therefore

$$
Z^2 = \frac{(X-\mu)^2}{\sigma^2} \sim \chi^2_1.
$$

### Densities for different degrees of freedom

The figure below shows the density curves of the chi-squared distribution for $3$, $5$ and $10$ degrees of freedom. As the number of degrees of freedom increases, the peak decreases and shifts to the right.

![Chi-squared distribution with degrees of freedom 3, 5 and 10](/images/lectures/01-stats-important-distros-in-stats/image_4.png)

### Tables for the chi-squared distribution

For a given number of degrees of freedom $\nu$ and a given $\alpha$, the table gives the value $\chi^2_{\alpha,\nu}$ such that

$$
P\{\chi^2 > \chi^2_{\alpha,\nu}\} = \alpha.
$$

In other words, $\chi^2_{\alpha,\nu}$ is the upper-tail critical value that leaves area $\alpha$ to its right.

![](/images/lectures/01-stats-important-distros-in-stats/image_5.png)

![](/images/lectures/01-stats-important-distros-in-stats/image_6.png)

#### Reading from the chi-squared table

Let $X \sim \chi^2_7$. Find $x$ such that $P\{X > x\}=0.025$.

Using the table for $7$ degrees of freedom and an upper-tail area of $0.025$,

$$
x = \chi^2_{0.025,7} = 16.01.
$$

![](/images/lectures/01-stats-important-distros-in-stats/image_7.png)

![](/images/lectures/01-stats-important-distros-in-stats/image_8.png)

## Student's $t$-distribution

If $X$ and $Y$ are independent random variables, where $X \sim N(0,1)$ and $Y \sim \chi^2_n$, then the random variable

$$
\boxed{T = \frac{X}{\sqrt{Y/n}}}
$$

has the **Student's $t$-distribution** with $n$ degrees of freedom, written

$$
T \sim t_n.
$$

Equivalently,

$$
\frac{N(0,1)}{\sqrt{\chi^2_n/n}} \sim t_n.
$$

The $t$-distribution depends on a single parameter, the number of degrees of freedom, and its range is $(-\infty,+\infty)$.

> **Intuition.** The $t$-distribution answers the question: what happens to the standardized mean if we replace the unknown $\sigma$ by an estimate $S$ from a limited sample? The extra randomness of $S$ makes the ratio more variable, so the $t$ curve has heavier tails than the normal curve. With many degrees of freedom the estimate $S$ becomes reliable, and the $t$ curve visibly merges into the normal curve.

![](/images/lectures/01-stats-important-distros-in-stats/image_9.png)

### Tables for the $t$-distribution

For a given number of degrees of freedom $\nu$ and a given $\alpha$, the $t$-table gives the value $t_{\alpha,\nu}$ such that

$$
P\{T > t_{\alpha,\nu}\} = \alpha.
$$

![](/images/lectures/01-stats-important-distros-in-stats/image_10.png)

![$t_{0.05,7}=2.365$](/images/lectures/01-stats-important-distros-in-stats/image_11.png)

![$t_{0.005,13}=3.012$](/images/lectures/01-stats-important-distros-in-stats/image_12.png)

#### Reading from the $t$-table

If $T \sim t_{18}$, determine $x$ such that

$$
P\{T > x\}=0.25.
$$

From the $t$-table,

$$
x = t_{0.25,18} = 0.688.
$$

![](/images/lectures/01-stats-important-distros-in-stats/image_13.png)

![](/images/lectures/01-stats-important-distros-in-stats/image_14.png)

As the number of degrees of freedom increases, the density curves of the $t$-distribution approach the standard normal density. The approximation is usually considered good when $n>30$.

![](/images/lectures/01-stats-important-distros-in-stats/image_15.png)

### Comparison with the standard normal distribution

If $T \sim t_{45}$ and we need $x$ such that $P\{T > x\}=0.25$, we can use the approximation $T \approx Z$. Then

$$
P\{T > x\} \approx P\{Z > x\} = 0.25,
$$

so

$$
P\{Z < x\} = 0.75.
$$

Looking up $0.75$ in the standard normal table gives

$$
x \approx 0.67.
$$

## Fisher's $F$-distribution

The Fisher distribution arises from the ratio of two independent chi-squared variables, each divided by its own degrees of freedom. If $X \sim \chi^2_{n_1}$ and $Y \sim \chi^2_{n_2}$ are independent, then

$$
\boxed{F = \frac{X/n_1}{Y/n_2}}
$$

has a **Fisher $F$-distribution** with $n_1$ and $n_2$ degrees of freedom, written

$$
F \sim F_{n_1,n_2}.
$$

The number $n_1$ is the **numerator degrees of freedom**, and $n_2$ is the **denominator degrees of freedom**. The distribution is absolutely continuous and depends on these two parameters. Its range is $(0,+\infty)$.

> **Intuition.** The $F$-statistic is a ratio of two estimated variances, each corrected for its degrees of freedom. If the two underlying variances are equal, the two estimates should be of comparable size and the ratio should be near $1$. A ratio far above $1$ (or, through the reciprocal relation, far below $1$) is evidence that the variances differ. Since variances are positive, the $F$-distribution is defined only on $(0,+\infty)$.

![Fisher distribution](/images/lectures/01-stats-important-distros-in-stats/image_16.png)

### Tables for the $F$-distribution

For given degrees of freedom $\nu_1$ and $\nu_2$ and a given $\alpha$, the table gives the value $f_{\alpha,\nu_1,\nu_2}$ such that

$$
P\{F > f_{\alpha,\nu_1,\nu_2}\} = \alpha,
$$

where $F \sim F_{\nu_1,\nu_2}$.

![](/images/lectures/01-stats-important-distros-in-stats/image_17.png)

For example,

$$
f_{0.025,10,5} = 6.62
$$

and

$$
f_{0.05,5,10} = 3.33.
$$

The tables usually give only the upper tail, for small $\alpha$. The reciprocal identity below lets us convert a lower-tail value into an upper-tail value by swapping the two degrees of freedom. In this way, one table can also answer questions about the left tail.

A practical difficulty is that $F$-tables exist only for a few (mainly small) values of $\alpha$. If we need another value of $\alpha$, we use the identity

$$
f_{1-\alpha,\nu_1,\nu_2} = \frac{1}{f_{\alpha,\nu_2,\nu_1}}.
$$

For example, to obtain a value for $\alpha=0.95$,

$$
f_{0.95,10,15} = \frac{1}{f_{0.05,15,10}} = \frac{1}{2.85} \approx 0.35.
$$
