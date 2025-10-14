"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, Filter, RefreshCw, Eye } from "lucide-react";
import DatePicker from "@/components/DatePicker";
import PredictionBadges from "@/components/PredictionBadges";
import ImageModal from "@/components/ImageModal";
import { Skeleton } from "@/components/ui/skeleton";

interface CollectionData {
  id: number;
  house_id: string;
  Image1: string;
  Image2?: string;
  createdAt: string;
  Image1_prediction: any;
  Image2_prediction?: any;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface DataTableProps {
  initialData?: CollectionData[];
  initialPagination?: PaginationInfo;
}

export default function DataTable({ initialData = [], initialPagination }: DataTableProps) {
  const [data, setData] = useState<CollectionData[]>(initialData);
  const [pagination, setPagination] = useState<PaginationInfo | null>(initialPagination || null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    date: new Date(), // Default to today
    house_id: "",
    page: 1,
    limit: 20,
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.date) {
        const dateStr = filters.date instanceof Date 
          ? filters.date.toISOString().split('T')[0] 
          : filters.date;
        params.append("date", dateStr);
      }
      if (filters.house_id) params.append("house_id", filters.house_id);
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());

      const response = await fetch(`/api/collection-data?${params}`);
      const result = await response.json();
      
      setData(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }
    fetchData();
  }, [filters]);

  // Debug: Log data when it changes
  useEffect(() => {
    if (data.length > 0) {
      console.log('Data loaded:', data[0]);
      console.log('First image URL:', data[0].Image1);
    }
  }, [data]);

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: string) => {
    setFilters(prev => ({ ...prev, limit: parseInt(newLimit), page: 1 }));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setFilters(prev => ({ ...prev, date: newDate || new Date(), page: 1 }));
  };

  const handleHouseIdChange = (newHouseId: string) => {
    setFilters(prev => ({ ...prev, house_id: newHouseId, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      date: new Date(),
      house_id: "",
      page: 1,
      limit: 20,
    });
  };

  const handleImageClick = (imageUrl: string, title: string) => {
    console.log('Image clicked:', imageUrl, title);
    setSelectedImage({ url: imageUrl, title });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-16 w-16 rounded" />
          <Skeleton className="h-16 w-16 rounded" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <DatePicker
                value={filters.date}
                onChange={handleDateChange}
                placeholder="Select date"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">House ID</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={filters.house_id}
                  onChange={(e) => handleHouseIdChange(e.target.value)}
                  className="pl-10"
                  placeholder="Search house ID"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Results per page</label>
              <Select value={filters.limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <Button onClick={clearFilters} variant="outline" className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Collection Data</CardTitle>
              {pagination && (
                <p className="text-sm text-muted-foreground">
                  Showing {data.length} of {pagination.totalCount} results
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSkeleton />
          ) : data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No data found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead className="w-32">House ID</TableHead>
                    <TableHead className="w-20">Image 1</TableHead>
                    <TableHead className="w-20">Image 2</TableHead>
                    <TableHead className="w-48">Prediction 1</TableHead>
                    <TableHead className="w-48">Prediction 2</TableHead>
                    <TableHead className="w-40">Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.house_id}</TableCell>
                      <TableCell>
                        <div 
                          className="relative w-16 h-16 group cursor-pointer bg-gray-200 rounded overflow-hidden"
                          onClick={() => handleImageClick(item.Image1, `Image 1 - House ${item.house_id}`)}
                        >
                          {imageErrors.has(item.Image1) ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-xs">
                              <span>No Image</span>
                            </div>
                          ) : (
                            <>
                              <Image
                                src={item.Image1}
                                alt="Image 1"
                                fill
                                className="object-cover rounded hover:opacity-80 transition-opacity"
                                onLoad={() => console.log('Image loaded successfully:', item.Image1)}
                                onError={(e) => {
                                  console.error('Image load error:', item.Image1);
                                  setImageErrors(prev => new Set([...prev, item.Image1]));
                                  e.currentTarget.style.display = 'none';
                                }}
                                unoptimized={true}
                              />
                              {/* Fallback for debugging */}
                              <div className="absolute top-0 left-0 text-xs bg-red-500 text-white p-1 opacity-0 hover:opacity-100">
                                {item.Image1.substring(0, 20)}...
                              </div>
                            </>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
                            <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.Image2 ? (
                          <div 
                            className="relative w-16 h-16 group cursor-pointer bg-gray-200 rounded overflow-hidden"
                            onClick={() => handleImageClick(item.Image2, `Image 2 - House ${item.house_id}`)}
                          >
                            {imageErrors.has(item.Image2) ? (
                              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-xs">
                                <span>No Image</span>
                              </div>
                            ) : (
                              <Image
                                src={item.Image2}
                                alt="Image 2"
                                fill
                                className="object-cover rounded hover:opacity-80 transition-opacity"
                                onLoad={() => console.log('Image loaded successfully:', item.Image2)}
                                onError={(e) => {
                                  console.error('Image load error:', item.Image2);
                                  setImageErrors(prev => new Set([...prev, item.Image2]));
                                  e.currentTarget.style.display = 'none';
                                }}
                                unoptimized={true}
                              />
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
                              <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <PredictionBadges predictions={item.Image1_prediction} />
                      </TableCell>
                      <TableCell>
                        {item.Image2_prediction ? 
                          <PredictionBadges predictions={item.Image2_prediction} /> : 
                          <span className="text-muted-foreground">-</span>
                        }
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ""}
        title={selectedImage?.title || ""}
      />
    </div>
  );
}
