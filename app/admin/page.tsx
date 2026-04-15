'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { FileText, Users, Award, ArrowRight, Clock } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminHeader } from '@/components/admin/admin-header'

// 🔥 STORES CORRECTOS
import { usePostStore } from '@/lib/store/post.store'
import { usePartnerStore } from '@/lib/store/partner.store'
import { useCertificateStore } from '@/lib/store/certificate.store'
import { useCategoryStore } from '@/lib/store/category.store'

export default function DashboardPage() {
  const { posts, fetchPosts } = usePostStore()
  const { partners, fetchPartners } = usePartnerStore()
  const { certificates, fetchCertificates } = useCertificateStore()
  const { categories, fetchCategories } = useCategoryStore()

  // 🔥 FETCH REAL
  useEffect(() => {
    fetchPosts()
    fetchPartners()
    fetchCertificates()
    fetchCategories()
  }, [])

  const stats = [
    {
      title: 'Total Posts',
      value: posts.length,
      description: `${posts.filter((p) => p.status === 'published').length} published`,
      icon: FileText,
      href: '/admin/posts',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Partners',
      value: partners.length,
      description: 'Active partners',
      icon: Users,
      href: '/admin/partners',
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      title: 'Certificates',
      value: certificates.length,
      description: 'Documents uploaded',
      icon: Award,
      href: '/admin/certificates',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ]

  // 🔥 FIX: no mutar estado
  const recentPosts = [...posts]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime()
    )
    .slice(0, 5)

  return (
    <div className="flex flex-1 flex-col">
      <AdminHeader title="Dashboard" />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your CMS admin panel
          </p>
        </div>

        {/* STATS */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>

                <div className={`${stat.bgColor} ${stat.color} rounded-lg p-2`}>
                  <stat.icon className="size-4" />
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>

                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>

                <Link
                  href={stat.href}
                  className="absolute inset-0"
                  aria-label={`View ${stat.title}`}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CONTENT */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* RECENT POSTS */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>
                  Latest content updates
                </CardDescription>
              </div>

              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/posts">
                  View all
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </CardHeader>

            <CardContent>
              {recentPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="size-8 mx-auto mb-2 opacity-50" />
                  <p>No posts yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPosts.map((post) => {
                    const category = categories.find(
                      (c) => c.id === post.categoryId
                    )

                    return (
                      <div
                        key={post.id}
                        className="flex items-start justify-between gap-4 rounded-lg border border-border/50 p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="font-medium hover:text-primary transition-colors line-clamp-1"
                          >
                            {post.title}
                          </Link>

                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="size-3" />

                            {/* 🔥 FIX FECHA */}
                            <span>
                              {new Date(post.updatedAt).toLocaleDateString(
                                'es-AR',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )}
                            </span>

                            {category && (
                              <>
                                <span className="text-border">|</span>
                                <span>{category.name}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <Badge
                          variant={
                            post.status === 'published'
                              ? 'default'
                              : 'secondary'
                          }
                          className={
                            post.status === 'published'
                              ? 'bg-primary/10 text-primary hover:bg-primary/20'
                              : ''
                          }
                        >
                          {post.status}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* QUICK ACTIONS */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3">
              <Button variant="outline" className="justify-start h-auto py-3" asChild>
                <Link href="/admin/posts/new">
                  <div className="bg-primary/10 text-primary rounded-lg p-2 mr-3">
                    <FileText className="size-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Create New Post</div>
                    <div className="text-xs text-muted-foreground">
                      Write and publish new content
                    </div>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-3" asChild>
                <Link href="/admin/partners">
                  <div className="bg-info/10 text-info rounded-lg p-2 mr-3">
                    <Users className="size-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Manage Partners</div>
                    <div className="text-xs text-muted-foreground">
                      Add or edit partner logos
                    </div>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" className="justify-start h-auto py-3" asChild>
                <Link href="/admin/certificates">
                  <div className="bg-warning/10 text-warning rounded-lg p-2 mr-3">
                    <Award className="size-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Manage Certificates</div>
                    <div className="text-xs text-muted-foreground">
                      Upload and manage documents
                    </div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 🔥 POWERED */}
        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          Powered by{' '}
          <a
            href="https://kodexa.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Kodexa
          </a>
        </div>
      </div>
    </div>
  )
}