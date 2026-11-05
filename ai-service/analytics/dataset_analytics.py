"""
Inkloom AI — Enterprise Dataset Analytics & Compliance Aggregations
Powered by Pandas & NumPy for Time-Series Trends & Risk Matrices
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_compliance_timeseries_df(days: int = 30) -> pd.DataFrame:
    """
    Constructs a Pandas DataFrame representing daily compliance metrics,
    rolling 7-day moving averages, and risk bounds.
    """
    np.random.seed(42)
    end_date = datetime.now()
    dates = [end_date - timedelta(days=d) for d in range(days - 1, -1, -1)]

    # Generate baseline compliance rates (trending from ~88% up to ~96% with slight daily noise)
    base_trend = np.linspace(88.0, 96.5, days)
    noise = np.random.normal(0, 1.8, days)
    daily_compliance = np.clip(base_trend + noise, 75.0, 100.0)

    # Daily audit volumes (between 12 and 35 per day)
    audit_volumes = np.random.randint(12, 38, days)
    violations = np.round(audit_volumes * ((100.0 - daily_compliance) / 100.0)).astype(int)

    df = pd.DataFrame({
        "date": [d.strftime("%Y-%m-%d") for d in dates],
        "compliance_rate": np.round(daily_compliance, 1),
        "audit_volume": audit_volumes,
        "violations_detected": violations
    })

    # Pandas Rolling Calculations
    df["rolling_7d_compliance"] = np.round(df["compliance_rate"].rolling(window=7, min_periods=1).mean(), 1)
    df["rolling_7d_volatility"] = np.round(df["compliance_rate"].rolling(window=7, min_periods=1).std().fillna(0), 2)
    df["cumulative_audits"] = df["audit_volume"].cumsum()
    df["cumulative_violations"] = df["violations_detected"].cumsum()

    return df

def aggregate_channel_compliance() -> list:
    """
    Uses Pandas to group, aggregate, and calculate risk indices across marketing channels.
    """
    raw_data = [
        {"channel": "Email Marketing", "audits": 142, "approved": 131, "critical_issues": 3, "warnings": 11, "avg_words": 185},
        {"channel": "Social Media / LinkedIn", "audits": 286, "approved": 277, "critical_issues": 1, "warnings": 14, "avg_words": 62},
        {"channel": "Landing Pages", "audits": 94, "approved": 82, "critical_issues": 5, "warnings": 18, "avg_words": 420},
        {"channel": "Display Ad Copy", "audits": 110, "approved": 97, "critical_issues": 4, "warnings": 15, "avg_words": 28},
        {"channel": "Press Releases", "audits": 48, "approved": 48, "critical_issues": 0, "warnings": 2, "avg_words": 550}
    ]

    df = pd.DataFrame(raw_data)
    
    # Pandas vector calculations
    df["compliance_rate"] = np.round((df["approved"] / df["audits"]) * 100, 1)
    df["violation_density"] = np.round(((df["critical_issues"] * 2 + df["warnings"]) / df["audits"]) * 100, 1)
    
    # Assign risk tier based on compliance
    conditions = [
        df["compliance_rate"] >= 95.0,
        df["compliance_rate"] >= 90.0,
        df["compliance_rate"] < 90.0
    ]
    choices = ["LOW", "MODERATE", "ELEVATED"]
    df["risk_level"] = np.select(conditions, choices, default="MODERATE")

    return df.to_dict(orient="records")

def get_recurring_violation_breakdown() -> list:
    """
    Returns aggregated violation category distribution with Pandas frequency percentages.
    """
    categories = [
        {"category": "Restricted Buzzwords & Superlatives", "count": 42, "severity": "Critical", "benchmark_limit": 10},
        {"category": "Unsupported Claims & Guarantees", "count": 28, "severity": "High", "benchmark_limit": 15},
        {"category": "Visual Violations & Brand Palettes", "count": 18, "severity": "Medium", "benchmark_limit": 20},
        {"category": "Readability & Accessibility Gaps", "count": 14, "severity": "Low", "benchmark_limit": 25}
    ]
    df = pd.DataFrame(categories)
    total_violations = df["count"].sum()
    df["percentage"] = np.round((df["count"] / total_violations) * 100, 1)
    return df.to_dict(orient="records")
