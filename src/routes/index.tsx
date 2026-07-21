import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShoppingBasket, TrendingUp, Sparkles, ArrowRight, Package, Zap, BarChart3, Search, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import rulesData from "@/data/rules.json";

type Rule = {
  antecedents: string[];
  consequents: string[];
  support: number;
  confidence: number;
  lift: number;
};

const DATA = rulesData as {
  rules: Rule[];
  items: string[];
  item_support: Record<string, number>;
  n_transactions: number;
  n_items: number;
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BasketIQ — Apriori Market Basket Analysis" },
      { name: "description", content: "Explore 2,868 association rules mined from 9,835 grocery transactions using the Apriori algorithm." },
      { property: "og:title", content: "BasketIQ — Apriori Market Basket Analysis" },
      { property: "og:description", content: "Interactive Apriori rule explorer with support, confidence, and lift filters." },
    ],
  }),
  component: Index,
});

function Index() {
  const [minSupport, setMinSupport] = useState(0.01);
  const [minConfidence, setMinConfidence] = useState(0.3);
  const [minLift, setMinLift] = useState(1.5);
  const [search, setSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itemSearch, setItemSearch] = useState("");

  const filteredRules = useMemo(() => {
    const q = search.toLowerCase().trim();
    return DATA.rules
      .filter(
        (r) =>
          r.support >= minSupport &&
          r.confidence >= minConfidence &&
          r.lift >= minLift &&
          (!q ||
            r.antecedents.some((a) => a.toLowerCase().includes(q)) ||
            r.consequents.some((c) => c.toLowerCase().includes(q))),
      )
      .slice(0, 200);
  }, [minSupport, minConfidence, minLift, search]);

  const totalMatching = useMemo(
    () =>
      DATA.rules.filter(
        (r) => r.support >= minSupport && r.confidence >= minConfidence && r.lift >= minLift,
      ).length,
    [minSupport, minConfidence, minLift],
  );

  const recommendations = useMemo(() => {
    if (selectedItems.length === 0) return [];
    const set = new Set(selectedItems);
    const matches = DATA.rules
      .filter(
        (r) =>
          r.antecedents.every((a) => set.has(a)) &&
          !r.consequents.every((c) => set.has(c)),
      )
      .sort((a, b) => b.lift - a.lift);
    const seen = new Set<string>();
    const out: { item: string; confidence: number; lift: number; support: number; via: string[] }[] = [];
    for (const r of matches) {
      for (const c of r.consequents) {
        if (!seen.has(c) && !set.has(c)) {
          seen.add(c);
          out.push({ item: c, confidence: r.confidence, lift: r.lift, support: r.support, via: r.antecedents });
        }
      }
      if (out.length >= 10) break;
    }
    return out;
  }, [selectedItems]);

  const topItems = useMemo(() => {
    const q = itemSearch.toLowerCase().trim();
    return DATA.items
      .filter((i) => (!q ? true : i.toLowerCase().includes(q)))
      .sort((a, b) => (DATA.item_support[b] ?? 0) - (DATA.item_support[a] ?? 0))
      .slice(0, q ? 40 : 30);
  }, [itemSearch]);

  const stats = useMemo(() => {
    const rls = filteredRules;
    return {
      shown: rls.length,
      total: totalMatching,
      avgLift: rls.length ? (rls.reduce((s, r) => s + r.lift, 0) / rls.length).toFixed(2) : "—",
      topLift: rls[0]?.lift.toFixed(2) ?? "—",
    };
  }, [filteredRules, totalMatching]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/70 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-gradient-brand flex items-center justify-center shadow-glow">
              <ShoppingBasket className="size-5 text-brand-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">BasketIQ</h1>
              <p className="text-xs text-muted-foreground leading-tight">Apriori · mlxtend</p>
            </div>
          </div>
          <div className="flex gap-2 text-xs">
            <Badge variant="secondary" className="gap-1"><Package className="size-3" /> {DATA.n_items} items</Badge>
            <Badge variant="secondary" className="gap-1"><Zap className="size-3" /> {DATA.n_transactions.toLocaleString()} tx</Badge>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 text-center">
        <Badge className="mb-4 bg-accent text-accent-foreground border-0">
          <Sparkles className="size-3 mr-1" /> Precomputed with mlxtend Apriori
        </Badge>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
          What your customers <span className="bg-gradient-brand bg-clip-text text-transparent">buy together</span>
        </h2>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
          {DATA.rules.length.toLocaleString()} association rules mined from the classic groceries dataset. Filter by support, confidence, and lift — or build a basket to get live recommendations.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="size-4 text-primary" />
              <h3 className="font-semibold">Rule Filters</h3>
            </div>
            <div className="space-y-5">
              {[
                { label: "Min Support", val: minSupport, set: setMinSupport, min: 0.005, max: 0.2, step: 0.005, hint: "Itemset frequency floor" },
                { label: "Min Confidence", val: minConfidence, set: setMinConfidence, min: 0.05, max: 1, step: 0.05, hint: "P(consequent | antecedent)" },
                { label: "Min Lift", val: minLift, set: setMinLift, min: 1, max: 10, step: 0.1, hint: "Strength vs random co-occurrence" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <label className="font-medium">{s.label}</label>
                    <span className="text-primary font-mono">{s.val.toFixed(s.step < 0.01 ? 3 : 2)}</span>
                  </div>
                  <Slider value={[s.val]} min={s.min} max={s.max} step={s.step} onValueChange={(v) => s.set(v[0])} />
                  <p className="text-xs text-muted-foreground mt-1">{s.hint}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 shadow-card bg-gradient-brand text-brand-foreground border-0">
            <div className="text-xs uppercase tracking-wide opacity-80 mb-1">Matching Rules</div>
            <div className="text-4xl font-bold">{stats.total.toLocaleString()}</div>
            <div className="text-sm opacity-90 mt-1">
              of {DATA.rules.length.toLocaleString()} total mined
            </div>
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="opacity-80 text-xs">Avg Lift</div>
                <div className="font-bold text-lg">{stats.avgLift}</div>
              </div>
              <div>
                <div className="opacity-80 text-xs">Top Lift</div>
                <div className="font-bold text-lg">{stats.topLift}×</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-card text-xs text-muted-foreground">
            <div className="font-semibold text-foreground mb-1">About the model</div>
            <p>Rules generated with <code className="bg-muted px-1 rounded">mlxtend.apriori</code> at min_support=0.005, then <code className="bg-muted px-1 rounded">association_rules</code> filtered by lift≥1.0. Adjust thresholds above to narrow live.</p>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="rules">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="rules"><TrendingUp className="size-4 mr-2" />Association Rules</TabsTrigger>
              <TabsTrigger value="recommend"><Sparkles className="size-4 mr-2" />Basket Recommender</TabsTrigger>
            </TabsList>

            <TabsContent value="rules" className="mt-4 space-y-3">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search items in rules (e.g. yogurt, whole milk)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Card className="shadow-card overflow-hidden">
                <div className="overflow-x-auto max-h-[600px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                      <TableRow>
                        <TableHead>Antecedents</TableHead>
                        <TableHead></TableHead>
                        <TableHead>Consequents</TableHead>
                        <TableHead className="text-right">Sup</TableHead>
                        <TableHead className="text-right">Conf</TableHead>
                        <TableHead className="text-right">Lift</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRules.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                            No rules match. Lower the thresholds.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRules.map((r, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {r.antecedents.map((a) => <Badge key={a} variant="secondary" className="capitalize">{a}</Badge>)}
                              </div>
                            </TableCell>
                            <TableCell><ArrowRight className="size-4 text-muted-foreground" /></TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {r.consequents.map((c) => <Badge key={c} className="bg-accent text-accent-foreground border-0 capitalize">{c}</Badge>)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs">{r.support.toFixed(3)}</TableCell>
                            <TableCell className="text-right font-mono text-xs">{r.confidence.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant="default" className={r.lift >= 3 ? "bg-gradient-brand text-brand-foreground border-0" : "bg-secondary text-secondary-foreground"}>
                                {r.lift.toFixed(2)}×
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                {totalMatching > filteredRules.length && (
                  <div className="p-3 text-center text-xs text-muted-foreground border-t border-border">
                    Showing top {filteredRules.length} of {totalMatching.toLocaleString()} matching rules
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="recommend" className="mt-4">
              <Card className="p-6 shadow-card">
                <h3 className="font-semibold mb-1">Build a Basket</h3>
                <p className="text-sm text-muted-foreground mb-4">Pick items — we'll find high-lift rules whose antecedents match your basket.</p>

                {selectedItems.length > 0 && (
                  <div className="mb-4 p-3 rounded-lg bg-accent/40 border border-accent flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-medium text-accent-foreground mr-1">In basket:</span>
                    {selectedItems.map((i) => (
                      <button key={i} onClick={() => setSelectedItems((s) => s.filter((x) => x !== i))}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-brand text-brand-foreground text-xs font-medium capitalize">
                        {i} <X className="size-3" />
                      </button>
                    ))}
                    <button onClick={() => setSelectedItems([])} className="ml-auto text-xs text-muted-foreground hover:text-foreground underline">clear</button>
                  </div>
                )}

                <div className="relative mb-3">
                  <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search 171 items…" value={itemSearch} onChange={(e) => setItemSearch(e.target.value)} className="pl-9" />
                </div>
                <div className="flex flex-wrap gap-2 mb-6 max-h-56 overflow-y-auto p-1">
                  {topItems.map((p) => {
                    const active = selectedItems.includes(p);
                    return (
                      <button key={p}
                        onClick={() => setSelectedItems((s) => s.includes(p) ? s.filter((x) => x !== p) : [...s, p])}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
                          active
                            ? "bg-gradient-brand text-brand-foreground border-transparent shadow-glow"
                            : "bg-surface border-border hover:border-primary/50"
                        }`}>
                        {p}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" /> Suggested Next Items
                  </h4>
                  {selectedItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Pick one or more items to see suggestions.</p>
                  ) : recommendations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No strong rules match this basket. Try adding a common item like <em>whole milk</em> or <em>yogurt</em>.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {recommendations.map((r) => (
                        <div key={r.item} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border hover:border-primary/40 transition-colors">
                          <div className="min-w-0">
                            <div className="font-semibold capitalize truncate">{r.item}</div>
                            <div className="text-xs text-muted-foreground truncate">via {r.via.join(" + ")}</div>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <div className="font-mono text-sm font-bold text-primary">{r.lift.toFixed(1)}×</div>
                            <div className="text-xs text-muted-foreground">{(r.confidence * 100).toFixed(0)}% conf</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <footer className="border-t border-border/50 py-6 text-center text-sm text-muted-foreground">
        Apriori · Support × Confidence × Lift · Powered by mlxtend
      </footer>
    </div>
  );
}
