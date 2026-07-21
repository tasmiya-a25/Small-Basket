# 🛒 Market Basket Analysis using Apriori Algorithm

## 📌 Project Overview

This project demonstrates **Market Basket Analysis**, an unsupervised machine learning technique used to discover relationships between products purchased together by customers. Using the **Apriori Algorithm**, the project identifies frequent item combinations and generates association rules that help businesses improve product recommendations, store layouts, and promotional strategies.

The project is designed as a beginner-friendly implementation while following an industry-standard machine learning workflow.

---

## 🎯 Objectives

* Understand Association Rule Learning.
* Perform data preprocessing on transactional data.
* Generate frequent itemsets using the Apriori algorithm.
* Create association rules using Support, Confidence, and Lift.
* Visualize the discovered patterns.
* Extract meaningful business insights from the generated rules.

---

## 📂 Dataset

**Dataset:** Groceries Market Basket Dataset

The dataset contains customer shopping transactions, where each transaction consists of multiple products purchased together.

Example:

| Transaction        |
| ------------------ |
| Milk, Bread, Eggs  |
| Bread, Butter      |
| Milk, Bread        |
| Yogurt, Whole Milk |

---

## 🛠️ Technologies Used

* Python
* Pandas
* NumPy
* Matplotlib
* mlxtend
* Jupyter Notebook

---

## 📚 Machine Learning Technique

### Unsupervised Learning

**Algorithm Used:**

* Apriori Algorithm

**Concepts Covered:**

* Association Rule Learning
* Frequent Itemsets
* Support
* Confidence
* Lift
* Market Basket Analysis

---

## ⚙️ Project Workflow

1. Import required libraries.
2. Load the dataset.
3. Explore and understand the data.
4. Preprocess transactional data.
5. Convert transactions into one-hot encoded format.
6. Generate frequent itemsets using Apriori.
7. Generate association rules.
8. Visualize results.
9. Interpret business insights.

---

## 📊 Visualizations

The project includes:

* Top Selling Products
* Frequent Itemsets
* Support Distribution
* Support vs Confidence Scatter Plot

---

## 📈 Evaluation Metrics

### Support

Measures how frequently an itemset appears in the dataset.

### Confidence

Measures the probability that a customer buys one product when another product is purchased.

### Lift

Measures how strongly two products are associated compared to random chance.

---

## 💼 Business Applications

* Product Recommendation Systems
* Frequently Bought Together Suggestions
* Cross-selling Opportunities
* Store Shelf Optimization
* Bundle Offer Creation
* Inventory Planning
* Customer Purchase Behavior Analysis

---

## 📁 Project Structure

```
Market-Basket-Analysis/
│
├── data/
│   └── Groceries_dataset.csv
│
├── notebooks/
│   └── Market_Basket_Analysis.ipynb
│
├── images/
│   ├── top_products.png
│   ├── frequent_itemsets.png
│   └── support_confidence.png
│
├── README.md
└── requirements.txt
```

---

## ▶️ Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/Market-Basket-Analysis.git
```

Install the required libraries:

```bash
pip install pandas numpy matplotlib mlxtend
```

Run the Jupyter Notebook:

```bash
jupyter notebook
```

---

## 📌 Results

The Apriori algorithm successfully identified frequently purchased product combinations and generated meaningful association rules using Support, Confidence, and Lift. These insights can help retailers improve customer experience, increase sales through targeted promotions, and optimize product placement.

---

## 🚀 Future Improvements

* Implement the FP-Growth algorithm for faster processing.
* Build a product recommendation system.
* Develop an interactive dashboard using Streamlit.
* Compare Apriori with FP-Growth performance.
* Deploy the project as a web application.

---

## 🎓 Learning Outcomes

Through this project, you will learn:

* Unsupervised Machine Learning
* Association Rule Learning
* Data Preprocessing
* Transaction Encoding
* Frequent Pattern Mining
* Data Visualization
* Business Insight Generation
* Real-world Retail Analytics

---

## 👨‍💻 Author
Tasmiya.a

If you found this project helpful, consider giving the repository a ⭐ to support the work.
