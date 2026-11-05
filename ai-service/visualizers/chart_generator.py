"""
Inkloom AI — Matplotlib Visual Analytics Engine
Generates publication-ready, base64-encoded visual charts styled for Inkloom AI
"""

import io
import base64
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Headless backend
import matplotlib.pyplot as plt
from matplotlib.patches import Patch
import pandas as pd

from analytics.dataset_analytics import generate_compliance_timeseries_df, get_recurring_violation_breakdown

# Inkloom AI Brand Color Palette
COLORS = {
    "navy": "#142B4A",
    "teal": "#176B59",
    "green": "#2E7D32",
    "amber": "#D97706",
    "red": "#DC2626",
    "slate": "#64748B",
    "light_gray": "#F1F5F9",
    "card_bg": "#FFFFFF"
}

def fig_to_base64(fig) -> str:
    """Encodes a Matplotlib figure into a high-res base64 PNG data URL."""
    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=160, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    buf.seek(0)
    encoded = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)
    return f"data:image/png;base64,{encoded}"

def render_tone_distribution_chart(prob_dict: dict) -> str:
    """
    Renders a clean horizontal bar chart displaying scikit-learn ML tone classification probabilities.
    """
    tones = list(prob_dict.keys())
    probs = [prob_dict[t] * 100 for t in tones]

    # Color each tone bar contextually
    bar_colors = []
    for t in tones:
        if "Professional" in t:
            bar_colors.append(COLORS["teal"])
        elif "Casual" in t:
            bar_colors.append(COLORS["navy"])
        elif "Hype" in t or "Aggressive" in t:
            bar_colors.append(COLORS["red"])
        elif "Technical" in t:
            bar_colors.append(COLORS["slate"])
        else:
            bar_colors.append(COLORS["amber"])

    fig, ax = plt.subplots(figsize=(7.5, 3.2), facecolor="#FFFFFF")
    ax.set_facecolor("#FAFAFC")

    y_pos = np.arange(len(tones))
    bars = ax.barh(y_pos, probs, color=bar_colors, height=0.55, edgecolor="none", zorder=3)

    # Styling
    ax.set_yticks(y_pos)
    ax.set_yticklabels(tones, fontsize=9, fontweight="bold", color="#1E293B")
    ax.invert_yaxis()  # top-down
    ax.set_xlabel("ML Model Confidence Probability (%)", fontsize=9, color=COLORS["slate"], labelpad=8)
    ax.set_xlim(0, 100)
    ax.grid(axis='x', linestyle='--', alpha=0.4, color='#CBD5E1', zorder=0)

    # Value labels
    for bar in bars:
        width = bar.get_width()
        ax.text(width + 1.5, bar.get_y() + bar.get_height()/2.0, f"{width:.1f}%",
                va='center', ha='left', fontsize=8.5, fontweight="bold", color="#334155")

    # Brand alignment threshold line
    ax.axvline(x=50.0, color=COLORS["teal"], linestyle=':', linewidth=1.5, alpha=0.7)
    ax.text(50.5, len(tones) - 0.2, "Dominant Tone Threshold (50%)", fontsize=7.5, color=COLORS["teal"], style='italic')

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#E2E8F0')
    ax.spines['bottom'].set_color('#E2E8F0')

    plt.title("Scikit-Learn ML Multi-Class Tone Distribution", fontsize=11, fontweight="bold", color=COLORS["navy"], pad=12, loc='left')
    return fig_to_base64(fig)

def render_compliance_trend_chart(days: int = 30) -> str:
    """
    Renders 30-day historical compliance line chart with 7-day moving average and risk zones.
    """
    df = generate_compliance_timeseries_df(days)

    fig, ax = plt.subplots(figsize=(8.0, 3.6), facecolor="#FFFFFF")
    ax.set_facecolor("#FAFAFC")

    x = np.arange(len(df))
    daily_rates = df["compliance_rate"].values
    rolling_7d = df["rolling_7d_compliance"].values

    # Benchmark Risk Zones
    ax.axhspan(90, 100, color='#DCFCE7', alpha=0.35, label='High Compliance Band (>=90%)')
    ax.axhspan(80, 90, color='#FEF3C7', alpha=0.35, label='Observation Band (80-89%)')

    # Lines
    ax.plot(x, daily_rates, color='#94A3B8', alpha=0.6, linewidth=1.2, linestyle='--', marker='o', markersize=3, label='Daily Compliance Rate')
    ax.plot(x, rolling_7d, color=COLORS["teal"], linewidth=2.5, label='7-Day Rolling Moving Average (Pandas)')

    # Styling
    step = max(1, days // 6)
    ax.set_xticks(x[::step])
    ax.set_xticklabels(df["date"].iloc[::step], fontsize=8, color=COLORS["slate"], rotation=15)
    ax.set_ylim(70, 102)
    ax.set_ylabel("Compliance Score (%)", fontsize=9, color=COLORS["slate"], labelpad=8)
    ax.grid(axis='both', linestyle='--', alpha=0.4, color='#CBD5E1')

    ax.legend(loc='lower left', fontsize=8, frameon=True, facecolor='#FFFFFF', edgecolor='#E2E8F0')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#E2E8F0')
    ax.spines['bottom'].set_color('#E2E8F0')

    plt.title("30-Day Historical Enterprise Governance Trend (Pandas Aggregation)", fontsize=11, fontweight="bold", color=COLORS["navy"], pad=12, loc='left')
    return fig_to_base64(fig)

def render_violation_breakdown_donut() -> str:
    """
    Renders a donut chart illustrating violation category risk distribution.
    """
    categories = get_recurring_violation_breakdown()
    labels = [c["category"].split('(')[0].strip() for c in categories]
    counts = [c["count"] for c in categories]
    colors = [COLORS["red"], COLORS["amber"], COLORS["navy"], COLORS["teal"]]

    fig, ax = plt.subplots(figsize=(6.0, 3.4), facecolor="#FFFFFF")
    wedges, texts, autotexts = ax.pie(
        counts,
        labels=labels,
        autopct='%1.1f%%',
        pctdistance=0.75,
        startangle=140,
        colors=colors,
        textprops=dict(color="#1E293B", fontsize=8),
        wedgeprops=dict(width=0.45, edgecolor='#FFFFFF', linewidth=2)
    )

    for at in autotexts:
        at.set_color('#FFFFFF')
        at.set_fontsize(8)
        at.set_weight('bold')

    # Central label
    ax.text(0, 0, f"Total\n{sum(counts)}\nIssues", ha='center', va='center', fontsize=9, fontweight='bold', color=COLORS["navy"])

    plt.title("Violation Category Risk Breakdown (Slide 6/11)", fontsize=11, fontweight="bold", color=COLORS["navy"], pad=12)
    return fig_to_base64(fig)

def render_sentence_distribution_chart(sentence_lengths: list = None) -> str:
    """
    Renders a histogram of sentence word lengths with normal enterprise benchmark density overlay.
    """
    if not sentence_lengths or len(sentence_lengths) < 2:
        sentence_lengths = [14, 18, 22, 16, 25, 12, 19, 15, 28, 17]

    arr = np.array(sentence_lengths)
    mean_val = np.mean(arr)

    fig, ax = plt.subplots(figsize=(7.0, 3.0), facecolor="#FFFFFF")
    ax.set_facecolor("#FAFAFC")

    # Histogram
    bins = np.arange(min(arr) - 2, max(arr) + 4, 3)
    ax.hist(arr, bins=bins, color=COLORS["teal"], alpha=0.75, edgecolor="#FFFFFF", rwidth=0.85, zorder=3)

    # Benchmark range band (15-22 words per sentence is optimal for enterprise)
    ax.axvspan(14, 22, color='#DCFCE7', alpha=0.5, label='Recommended Range (14-22 words)', zorder=0)
    ax.axvline(mean_val, color=COLORS["navy"], linestyle='--', linewidth=2, label=f'Draft Mean ({mean_val:.1f} words)', zorder=4)

    ax.set_xlabel("Words per Sentence", fontsize=8.5, color=COLORS["slate"], labelpad=6)
    ax.set_ylabel("Sentence Count", fontsize=8.5, color=COLORS["slate"], labelpad=6)
    ax.grid(axis='y', linestyle='--', alpha=0.4, color='#CBD5E1', zorder=0)

    ax.legend(loc='upper right', fontsize=8, frameon=True, facecolor='#FFFFFF', edgecolor='#E2E8F0')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#E2E8F0')
    ax.spines['bottom'].set_color('#E2E8F0')

    plt.title("NumPy Sentence Length Distribution vs Enterprise Readability", fontsize=10.5, fontweight="bold", color=COLORS["navy"], pad=10, loc='left')
    return fig_to_base64(fig)
