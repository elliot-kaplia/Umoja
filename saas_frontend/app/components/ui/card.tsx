import React from 'react'

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`rounded-lg shadow-lg overflow-hidden ${className}`}
    {...props}
  />
)

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`relative aspect-[4/3] ${className}`}
    {...props}
  />
)

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={`text-[1.5rem] font-bold mb-2 font-fredoka ${className}`}
    {...props}
  />
)

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`p-4 ${className}`}
    {...props}
  />
)

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`px-4 pb-4 ${className}`}
    {...props}
  />
)