# Home-Clean PWA UI Wireframes

## Main Layout

```
+---------------------------------------+
| Home-Clean                      [≡]   | <- Header with hamburger menu
+---------------------------------------+
|                                       |
|  [Current View Content]               |
|                                       |
|                                       |
|                                       |
|                                       |
|                                       |
|                                       |
|                                       |
+---------------------------------------+
| [+] Add New                           | <- Floating action button
+---------------------------------------+
```

## Hamburger Menu

```
+---------------------------------------+
| [X] Home-Clean                        | <- Close button
+---------------------------------------+
| • Area Types                          |
| • Areas                               |
| • Area Groups                         |
| • Items                               |
| • Export/Import                       |
+---------------------------------------+
```

## List View (e.g., Area Types)

```
+---------------------------------------+
| Area Types                      [≡]   |
+---------------------------------------+
| • Room                                |
| • Living                              |
| • Dining                              |
| • Balcony                             |
|                                       |
|                                       |
|                                       |
+---------------------------------------+
| [+] Add Area Type                     |
+---------------------------------------+
```

## Detail View (e.g., Area)

```
+---------------------------------------+
| Kitchen (Room)                  [≡]   |
+---------------------------------------+
| Items:                                |
| • Fridge                      [🟢]    | <- Status indicator
| • Stove                       [🟡]    |
| • Sink                        [🔴]    |
|                                       |
|                                       |
|                                       |
+---------------------------------------+
| [+] Add Item                          |
+---------------------------------------+
```

## Edit Form (e.g., Item Part)

```
+---------------------------------------+
| Edit: Door Seal                 [≡]   |
+---------------------------------------+
| Name:                                 |
| [Door Seal                      ]     |
|                                       |
| Item:                                 |
| [Fridge                         ▼]    |
|                                       |
| Frequency (days):                     |
| [90                            ]      |
|                                       |
| Last Done:                            |
| [2023-05-15                    ]      |
|                                       |
| [Save]        [Delete]        [Cancel]|
+---------------------------------------+
```

## Item Part View

```
+---------------------------------------+
| Door Seal (Fridge)              [≡]   |
+---------------------------------------+
| Status: OVERDUE                 [🔴]  |
|                                       |
| Frequency: Every 90 days              |
| Last done: 120 days ago               |
| (2023-05-15)                          |
|                                       |
|                                       |
|                                       |
| [Mark Done]                           |
+---------------------------------------+
| [Edit]                                |
+---------------------------------------+
```

## Color Coding

- 🟢 Green: On schedule
- 🟡 Yellow: Due soon
- 🔴 Red: Overdue

## Mobile Responsiveness

- Single column layout
- Touch-friendly buttons (min 44px height)
- Responsive font sizes
- Bottom navigation for frequently used actions

