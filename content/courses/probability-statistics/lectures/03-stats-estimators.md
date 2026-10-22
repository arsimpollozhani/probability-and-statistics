---
title: "Estimators"
description: "How to turn a sample into a guess about an unknown parameter: method of moments, maximum likelihood, and what makes an estimator good."
tags: ["estimation", "method of moments", "maximum likelihood", "unbiasedness", "consistency"]
order: 3
---

## Why this lecture matters

In probability theory we know the model and compute probabilities. In statistics we observe data and must infer the model. The unknown quantity is usually a **parameter**: the probability $p$ that a drug works, the average waiting time $\mu$ in a queue, or the variance $\sigma^2$ of a measurement error. An **estimator** is a rule that uses the sample to propose a value for that parameter.

At a high level, estimation is how data become a model. Once we can estimate parameters, we can make predictions, quantify uncertainty, compare competing explanations, and decide whether an observed effect is real.

These ideas are used constantly in real life and in computing. Clinical trials estimate treatment effects; manufacturers estimate defect rates; economists estimate elasticities. In machine learning, maximum likelihood is the foundation of logistic regression, softmax classifiers, Gaussian mixture models, language models and many neural-network losses. Method-of-moments ideas appear in parameter initialization and in moment-matching methods such as batch normalization statistics. Understanding the properties of estimators (bias, variance, consistency) is also essential for evaluating models and understanding the bias-variance trade-off.

## From probability to statistics

In probability theory, mathematical models for random phenomena are studied. The starting point is a known probabilistic model, and based on that model we calculate probabilities of events and outcomes.

A typical question is: *if a given model applies to the observed experiment, what is the probability that a certain event will occur?*

**Example 1.** A coin is tossed, and we assume it is fair, so the probability of heads is $p=0.5$. The coin is tossed $5$ times.

**Question:** What is the probability of getting exactly $3$ heads in $5$ tosses?

Here the model is known: the number of heads is a random variable with the binomial distribution $B(5,0.5)$.

In statistics the starting point is observed data for a feature, represented by a random sample from the population. The model and its parameters are unknown and must be assumed, estimated and/or verified. The goal is to draw conclusions about the feature in the entire population based on the sample. The direction of inference is reversed: from real data to a probabilistic model and its parameters.

> **Intuition.** Probability asks "given the model, what data should I expect?" Statistics asks the opposite: "given the data, which model could have produced them?" The unknown parameter is the bridge between the two directions. An estimator is a rule that uses the observed sample to propose a plausible value for that parameter.

**Example 2.** A clinical trial is conducted with $100$ patients who receive a new drug. For each patient it is recorded whether the drug worked, giving a sample of $100$ observations.

**Question:** What is the probability $p$ that the drug works in the entire population?

It is reasonable to assume that the data come from a feature with a Bernoulli distribution $B(1,p)$. **The parameter $p$ is unknown and must be estimated from the observed sample.**

## The probabilistic model and the parameter space

Let the observed feature be modelled by a random variable $X$ with distribution function $F(x)$ depending on an unknown parameter $\theta$. The parameter $\theta$ may be a scalar or a vector. The set of all possible values of $\theta$ is denoted by $\Theta$ and is called the **parameter space**.

For example,

$$
X\sim P(\lambda), \qquad \theta=\lambda, \qquad \Theta=(0,\infty),
$$

or

$$
X\sim N(\mu,\sigma^2), \qquad \theta=(\mu,\sigma^2), \qquad \Theta=\mathbb{R}\times\mathbb{R}^+.
$$

To emphasize the dependence on $\theta$, we write $F(x,\theta)$ or

$$
F(x,\theta)=P_\theta\{X<x\}.
$$

In reality we do not have one distribution but a **family** of distributions,

$$
\{F(x,\theta) \mid \theta\in\Theta\}.
$$

## Data space and parameter space

Let $X=(X_1,X_2,\dots,X_n)$ be a random sample from the feature $X$. The **data space** $W$ is the set of all possible realizations of the sample.

For example:

- if $X\sim P(\lambda)$, then

$$
W=\{(x_1,x_2,\dots,x_n) \mid x_i\in\mathbb{N},\ i=1,\dots,n\};
$$

- if $X\sim B(m,p)$, then

$$
W=\{(x_1,x_2,\dots,x_n) \mid 0\le x_i\le m,\ x_i\in\mathbb{N},\ i=1,\dots,n\};
$$

- if $X\sim N(\mu,\sigma^2)$, then

$$
W=\mathbb{R}^n.
$$

**Question:** How can we estimate the unknown parameter $\theta$ from the sample? In this lecture we consider cases where the form of the distribution $F(x,\theta)$ is known, but $\theta$ (or some of its components) is unknown.

## What is an estimator?

**Definition.** Let $X=(X_1,X_2,\dots,X_n)$ be a random sample from the feature $X$ with distribution $F(x,\theta)$, where $\theta\in\Theta$ is an unknown parameter. An **estimator** (or point estimator) of $\theta$ is any statistic

$$
\hat{\theta}=f(X_1,X_2,\dots,X_n),
$$

where $f:W\to\Theta$ depends only on the random sample and contains no unknown parameters. The estimator $\hat{\theta}$ is a random variable. The specific value

$$
\hat{\theta}=f(x_1,\dots,x_n),
$$

obtained for a realization $(x_1,\dots,x_n)$ of the sample, is called an **estimate** of $\theta$.

> **Intuition.** The distinction between estimator and estimate is the same as between a random variable and one observed value. The estimator is the formula (for example, "take the sample mean"); the estimate is the number produced by that formula on one particular data set. Because the data are random, repeating the experiment would generally produce a different estimate.

## Methods for obtaining point estimators

The definition of an estimator is very broad. Not every estimator is a good estimator: it should satisfy certain properties, which we discuss later. We now introduce two simple methods for finding estimators that often have desirable properties:

- the **method of moments**;
- the **method of maximum likelihood**.

## Method of moments

How do we connect data with parameters?

The basic idea is that sample characteristics are good approximations of population characteristics. The $k$-th sample moment approximates the theoretical $k$-th moment:

$$
\frac{1}{n}\sum_{i=1}^{n}X_i^k \approx E[X^k].
$$

The theoretical moments depend on the unknown parameter $\theta$.

**Method of moments.** If the model depends on $K$ unknown parameters, take the first $K$ theoretical moments

$$
m_k(\theta)=E_\theta[X^k], \qquad k=1,\dots,K,
$$

and equate them with the corresponding sample moments:

$$
m_k(\theta)=\frac{1}{n}\sum_{i=1}^{n}X_i^k, \qquad k=1,\dots,K.
$$

This gives a system of equations from which the estimator $\hat{\theta}$ is determined.

> **Intuition.** The method of moments matches what the data say about averages, squares, cubes and so on with what the model predicts for those same quantities. If the model has $K$ unknown parameters, we need $K$ matching equations. The solution is the parameter value for which the first $K$ sample moments and theoretical moments agree.

## The likelihood function

Let $X=(X_1,X_2,\dots,X_n)$ be a random sample from the feature $X$ with distribution $F(x,\theta)$, where $\theta\in\Theta$ is an unknown parameter (or vector of parameters). Let $p(x,\theta)$ denote the probability mass function in the discrete case or the probability density function in the continuous case.

For a fixed sample

$$
x=(x_1,x_2,\dots,x_n),
$$

the **likelihood function** of $\theta$ is

$$
L(\theta;x)=\prod_{i=1}^{n}p(x_i,\theta).
$$

The function $L(\theta;x)$ is considered as a function of $\theta$, with the observed values $x_1,\dots,x_n$ treated as constants.

> **Intuition.** The likelihood is not the probability of $\theta$; it is the probability (or density) of the observed data viewed as a function of $\theta$. The product reflects independence: for a fixed $\theta$, the chance of seeing the whole sample is the product of the chances of seeing each observation. A parameter value that makes the observed data more probable gives a larger likelihood.

### Interpreting the likelihood: one observation

Let us observe one value $x_1$ from $X\sim N(\mu,\sigma^2)$, with $\mu$ unknown. The figure shows two possible densities for this model, corresponding to two different values of $\mu$. The datum $x_1$ is more plausible under the second distribution than under the first. In fact, the likelihood

$$
L(\mu;x_1)=p(x_1\mid\mu,\sigma^2)
$$

is larger in the second case.

![](/images/lectures/03-stats-estimators/image.png)

### Interpreting the likelihood: several observations

Now let us observe $x_1,x_2,x_3$ from $X\sim N(\mu,\sigma^2)$. For the fixed sample $(x_1,x_2,x_3)$, the likelihood is

$$
L(\mu;x_1,x_2,x_3)=\prod_{i=1}^{3}p(x_i\mid\mu,\sigma^2),
$$

where $p(x\mid\mu,\sigma^2)$ is the normal density.

For this sample too, the likelihood is larger in the second case, because the second distribution fits the sample better. But is it the **most** suitable distribution for this sample?

**Idea:** find the distribution for which the likelihood function is maximized for the given sample.

> **Intuition.** Moving the density curve horizontally changes how high the curve sits above each observed point. The likelihood combines how well the curve covers all observations at once. The maximum likelihood estimate is the curve position that covers the observed points best, not necessarily the curve that passes through any single point.

![](/images/lectures/03-stats-estimators/image_2.png)

## Maximum likelihood estimation

The likelihood function is a function of the unknown parameter $\theta$. We want the value of $\theta$ for which the likelihood is maximized. It is usually easier to maximize the logarithm of the likelihood, because a product becomes a sum. The standard procedure is:

1. Determine the likelihood function $L(\theta;x)$.
2. Take the logarithm:

$$
\ell(\theta;x)=\ln L(\theta;x).
$$

3. Differentiate with respect to $\theta$ and set the derivative to zero:

$$
\frac{d\ell(\theta;x)}{d\theta}=0.
$$

4. Solve the resulting equation for $\theta$.

> **Intuition.** Taking logarithms turns a product into a sum, which is much easier to differentiate. This is allowed because $\ln$ is strictly increasing, so the value of $\theta$ that maximizes $L$ also maximizes $\ell$. The derivative condition finds a stationary point; in the usual models the likelihood is log-concave, so this stationary point is the maximum.

## Properties of estimators

An estimator is a random variable. For a different sample we obtain a different realization, i.e. a different estimate of the parameter. The question is how good this estimate is.

It is desirable for estimators to have the following properties.

- **Unbiasedness:** $E[\hat{\theta}]=\theta$. The estimator hits the true parameter value on average. Examples of unbiased estimators are $\overline{X}$ for $\mu=E[X]$ and $S^2=\frac{1}{n-1}\sum_{i=1}^{n}(X_i-\overline{X})^2$ for $\sigma^2=D[X]$.
- **Efficiency:** among unbiased estimators of the same parameter, the best one has the smallest variance.
- **Consistency:** as the sample size grows, $n\to\infty$, the estimator converges in probability to the true parameter value.

> **Intuition.** Unbiasedness is about the centre of the estimator's distribution: repeated samples should not systematically overestimate or underestimate the truth. Efficiency is about its spread: among unbiased estimators, we prefer the one whose estimates cluster most tightly around the truth. Consistency is about the long run: with enough data, the estimator should become arbitrarily close to the true value.

### Precision and accuracy

![](/images/lectures/03-stats-estimators/image_3.png)

**Accuracy** refers to closeness to the true value (low bias), while **precision** refers to closeness of repeated estimates to each other (low variance). An estimator can be precise but inaccurate if it is systematically shifted, or accurate on average but imprecise if it scatters widely.

## What comes next

Estimation gives us the best guess for a parameter based on a sample, but it does not by itself say how confident we should be in that guess. The next step is **hypothesis testing**: a method for checking whether an observed effect is statistically significant or could plausibly be due to chance.
