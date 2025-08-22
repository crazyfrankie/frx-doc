---
title: "frx"
linkTitle: "frx"
---

<style>
/* 修复主页代码块居中问题 */
.td-box--primary .highlight {
    display: flex;
    justify-content: center;
    width: 100%;
}

.td-box--primary .highlight pre {
    background-color: #0d1117 !important;
    color: #e6edf3 !important;
    border: 1px solid #30363d !important;
    border-radius: 6px !important;
    padding: 12px 16px !important;
    margin: 0 !important;
    text-align: center !important;
    width: fit-content !important;
    max-width: 90% !important;
    min-height: auto !important;
    line-height: 1.4 !important;
}

.td-box--primary .highlight code {
    color: #e6edf3 !important;
    display: block !important;
    text-align: center !important;
}

.td-box--primary .highlight code span[style*="display:flex"] {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 100% !important;
    min-height: auto !important;
}

.td-box--primary .highlight code span span[style*="color:#6e7681"] {
    color: #6e7681 !important;
    margin-right: 0.8em !important;
    padding: 0 0.3em !important;
    white-space: pre !important;
    user-select: none !important;
    -webkit-user-select: none !important;
    min-width: 1.5em !important;
    text-align: center !important;
}

.td-box--primary .highlight code span span:not([style*="color:#6e7681"]) {
    color: #e6edf3 !important;
    white-space: pre !important;
    text-align: center !important;
}
</style>

{{< blocks/cover title="frx" image_anchor="top" height="full" >}}
<a class="btn btn-lg btn-primary me-3 mb-4" href="/docs/">
  Get Started <i class="fas fa-arrow-alt-circle-right ms-2"></i>
</a>
<a class="btn btn-lg btn-secondary me-3 mb-4" href="https://github.com/crazyfrankie/frx">
  GitHub <i class="fab fa-github ms-2 "></i>
</a>
<p class="lead mt-5">Modern Go libraries for scalable applications</p>
{{< /blocks/cover >}}

{{% blocks/lead color="primary" %}}
frx is a collection of Go libraries designed for scalable applications, providing high-performance, modular, and production-ready solutions.

Get started with modern Go development in one command:

```bash
go get github.com/crazyfrankie/frx@latest
```
{{% /blocks/lead %}}

{{% blocks/section color="dark" type="row" %}}
{{% blocks/feature icon="fa-lightbulb" title="High Performance" %}}
Go libraries optimized for high-concurrency scenarios
{{% /blocks/feature %}}

{{% blocks/feature icon="fa-cubes" title="Modular Design" %}}
Lightweight modular architecture, use as needed
{{% /blocks/feature %}}

{{% blocks/feature icon="fa-check-circle" title="Production Ready" %}}
Battle-tested enterprise-grade solutions
{{% /blocks/feature %}}
{{% /blocks/section %}}
