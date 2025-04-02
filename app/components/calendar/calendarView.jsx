import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import dayjs from 'dayjs';
import { Colors } from '@/constants/Colors';
import weekday from 'dayjs/plugin/weekday';
import weekofYear from 'dayjs/plugin/weekOfYear';
import TopBarCalendar from './TopBarCalendar';

dayjs.extend(weekday);
dayjs.extend(weekofYear);

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(dayjs(Date.now())); // ✅ Use Date.now()
    
    const daysInMonth = currentDate.daysInMonth();
    const firstDayOfMonth = currentDate.startOf('month').day(); // Day of the week (0 = Sunday, 6 = Saturday)
    const lastDayOfMonth = currentDate.endOf('month').day();

    const prevMonth = currentDate.subtract(1, 'month');
    const nextMonth = currentDate.add(1, 'month');
    const daysInPrevMonth = prevMonth.daysInMonth();

    let days = [];
    let weeks = [];

    // Add previous month's days (gray)
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        days.push({ day: daysInPrevMonth - i, type: 'prev' });
    }

    // Add current month's days (normal)
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, type: 'current' });
    }

    // Add next month's days (gray)
    for (let i = 1; days.length % 7 !== 0; i++) {
        days.push({ day: i, type: 'next' });
    }

    // Split days into weeks
    while (days.length) {
        weeks.push(days.splice(0, 7));
    }

    const handleMonthChange = (direction) => {
        setCurrentDate((prevDate) => prevDate.add(direction, 'month'));
    };

    return (
        <View style={styles.Container}>
            <TopBarCalendar />
            <View style={styles.monthView}>
                <Pressable hitSlop={10} onPress={() => handleMonthChange(-1)}>
                    <AntDesign name="left" size={30} color="white" />
                </Pressable>
                <Text style={{ color: Colors.light.background, fontSize: 34, fontWeight: "700" }}>
                    {currentDate.format('MMMM')} <Text style={{ color: Colors.light.textDisabled, fontWeight: "500" }}>{currentDate.format('YYYY')}</Text>
                </Text>
                <Pressable hitSlop={10} onPress={() => handleMonthChange(1)}>
                    <AntDesign name="right" size={30} color="white" />
                </Pressable>
            </View>

            <View style={styles.calendar}>
                {/* Week Headers */}
                <View style={styles.weekRow}>
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                        <Text key={day} style={styles.weekDay}>{day}</Text>
                    ))}
                </View>

                {/* Calendar Days */}
                {weeks.map((week, i) => (
                    <View key={i} style={styles.weekRow}>
                        {week.map((item, j) => (
                            <View 
                                key={j} 
                                style={[
                                    styles.dayContainer, 
                                    item.type === 'current' && item.day === currentDate.date() ? styles.selectedDay : null
                                ]}
                            >
                                <Text 
                                    style={[
                                        styles.dayText, 
                                        item.type !== 'current' ? styles.grayText : null
                                    ]}
                                >
                                    {item.day}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 50,
        paddingHorizontal: "8%"
    },
    monthView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '5%',
        
    },
    calendar: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
        elevation: 10,
    },
    weekDay: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 5,
    },
    dayContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedDay: {
        backgroundColor: Colors.orange,
        borderRadius: 20,
    },
    dayText: {
        fontSize: 18,
        color: '#333',
    },
    grayText: {
        color: Colors.light.textDisabled, 
    },
});
