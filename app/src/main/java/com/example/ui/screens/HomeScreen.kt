package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.UserProfile
import com.example.ui.StudioViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: StudioViewModel,
    userProfile: UserProfile,
    onNavigate: (String) -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.primary),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Color.White)
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text("EditAI Studio", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                            Text(
                                if (userProfile.isPro) "PRO Creator Active" else "Starter Edition (Tap to Unlock)",
                                fontSize = 11.sp,
                                color = if (userProfile.isPro) Color(0xFF4CAF50) else MaterialTheme.colorScheme.error,
                                modifier = Modifier.clickable { onNavigate("monetization") }
                            )
                        }
                    }
                },
                actions = {
                    IconButton(onClick = { onNavigate("account") }, modifier = Modifier.testTag("account_button")) {
                        Icon(Icons.Default.AccountCircle, contentDescription = "Account")
                    }
                    IconButton(onClick = { onNavigate("settings") }, modifier = Modifier.testTag("settings_button")) {
                        Icon(Icons.Default.Settings, contentDescription = "Settings")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(4.dp))
                // Hero Banner / AI Quick Prompt Banner
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("AI Creator Suite", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.weight(1f))
                            Badge(containerColor = MaterialTheme.colorScheme.primary) {
                                Text("${userProfile.aiCredits} Credits")
                            }
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            "Type natural language commands: \"Is video ko cinematic banao\", \"Background hatao\", or \"Auto captions lagao\".",
                            fontSize = 13.sp,
                            color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                        )
                        Spacer(modifier = Modifier.height(14.dp))
                        Button(
                            onClick = { onNavigate("ai_creator") },
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("open_ai_creator_button"),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(Icons.Default.PlayArrow, contentDescription = null)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Open AI Assistant & Creator")
                        }
                    }
                }
            }

            item {
                Text("Studio Modules", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Spacer(modifier = Modifier.height(8.dp))
                // Grid of Modules
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        ModuleCard(
                            title = "Video Editor",
                            subtitle = "Multi-track & Chroma",
                            icon = Icons.Default.Movie,
                            color = Color(0xFFE91E63),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate("video_editor") }
                        )
                        ModuleCard(
                            title = "Photo Editor",
                            subtitle = "AI Removal & FX",
                            icon = Icons.Default.Edit,
                            color = Color(0xFF9C27B0),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate("photo_editor") }
                        )
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        ModuleCard(
                            title = "Thumbnail Maker",
                            subtitle = "YouTube & Shorts",
                            icon = Icons.Default.Image,
                            color = Color(0xFFFF9800),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate("thumbnail_maker") }
                        )
                        ModuleCard(
                            title = "Audio & Music",
                            subtitle = "Voice, FX & Beats",
                            icon = Icons.Default.AudioFile,
                            color = Color(0xFF00BCD4),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate("audio_editor") }
                        )
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        ModuleCard(
                            title = "Templates",
                            subtitle = "Reels & Shorts",
                            icon = Icons.Default.Dashboard,
                            color = Color(0xFF4CAF50),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate("templates") }
                        )
                        ModuleCard(
                            title = "Projects",
                            subtitle = "Drafts & Cloud",
                            icon = Icons.Default.Folder,
                            color = Color(0xFF3F51B5),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate("projects") }
                        )
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        ModuleCard(
                            title = "Monetization",
                            subtitle = "₹10 Unlock & Ads",
                            icon = Icons.Default.MonetizationOn,
                            color = Color(0xFFE65100),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate("monetization") }
                        )
                        ModuleCard(
                            title = "Admin Panel",
                            subtitle = "Dashboard & Stats",
                            icon = Icons.Default.AdminPanelSettings,
                            color = Color(0xFF607D8B),
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigate("admin") }
                        )
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(20.dp))
            }
        }
    }
}

@Composable
fun ModuleCard(
    title: String,
    subtitle: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .height(100.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = color.copy(alpha = 0.15f))
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(14.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(color),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(icon, contentDescription = null, tint = Color.White)
                }
                Icon(Icons.Default.ChevronRight, contentDescription = null, tint = color)
            }
            Column {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                Text(subtitle, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
            }
        }
    }
}
